// Message parser
import { URL } from './url';
import { Message } from './message';
import { Request, Methods } from './request';
import { Response, Statuses } from './response';
import { Notification, Events } from './notification';

var stringToUTF8Array = function(str) {
  var utf8 = [];
  for (var i=0; i < str.length; i++) {
    var charcode = str.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6),
                0x80 | (charcode & 0x3f));
    }
    else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12),
                0x80 | ((charcode>>6) & 0x3f),
                0x80 | (charcode & 0x3f));
    }
    else {
      // let's keep things simple and only handle chars up to U+FFFF...
      utf8.push(0xef, 0xbf, 0xbd); // U+FFFE "replacement character"
    }
  }
  return utf8;
};


var serializeHeaderToString = function(msg) {
  var raw = '';
  for (var k in msg.header) {
    raw += k + ": " + msg.header[k] + "\r\n";
  }
  return raw;
};

var serializeBodyToString = function(msg) {
  if (typeof msg.body !== 'undefined' && msg.body !== null)
    return "\r\n" + JSON.stringify(msg.body);
  return '';
};


var parseHead = function(string) {
  var message = null, seq = 0;
  var lines = string.split("\r\n");
  var main_line = lines.shift();
  var main = main_line.split(" ");

  // Identify the typ of the message
  var identifier = main[0];
  if (Methods.indexOf(identifier) >= 0) {
    if (main.length !== 3) {
      throw new Error("Request line does not consist of three parts");
    }
    message = new Request({method: identifier});
    if (main[1] !== '*') {
      message.url = new URL(main[1]);
    }
    seq = parseInt(main[2], 10);
  } else if (Statuses.indexOf(identifier) >= 0) {
    if (main.length !== 3) {
      throw new Error("Request line does not consist of three parts");
    }
    message = new Response({status: identifier});
    message.code = parseInt(main[1], 10);
    seq = parseInt(main[2], 10);
  } else if (Events.indexOf(identifier) >= 0) {
    if (main.length !== 2) {
      throw new Error("Request line does not consist of two parts");
    }
    message = new Notification({event: identifier});
    message.url = new URL(main[1]);
  } else {
    throw new Error("Type of message unknown: " + identifier);
  }

  // Read headers
  var currentLine = lines.shift();
  while (typeof currentLine  === "string" && currentLine !== "") {
    var [key, value, ...rest] = currentLine.split(": ");
    if (typeof key === 'string' && typeof value === 'string' && typeof rest === 'undefined') {
      message.header[key] = value;
    }
    else {
      throw new Error("Bad header format");
    }
    currentLine = lines.shift();
  }

  return [message, seq];
};

// Message serialization and parsing
var parseMessageString = function(string) {
  var [head, ...body] = string.split("\r\n\r\n");
  var [message, seq] = parseHead(head);

  // Read body
  if (body instanceof Array && body.length > 0) {
    body = body.join("\r\n");
    if (body !== '') {
      try {
        message.body = JSON.parse(body);
      }
      catch(e) {
        message.body = body;
      }
    }
  }

  return [message, seq];
};

var parseMessageBuffer = function(buffer) {
  var message = null;
  var string = '', buffer_length = buffer.byteLength, i = 0, new_buffer = null;
  buffer = new Uint8Array(buffer);
  while (i < buffer_length) {
    var b0 = buffer[i], b1 = buffer[i+1], b2 = buffer[i+2], b3 = buffer[i+3];
    if ((b0 & 0x80) === 0) {
      string += String.fromCharCode(b0);
      i += 1;
    }
    else if ((b0 & 0xE0) === 0xC0) {
      string += String.fromCharCode( (b0 << 6) + (b1 & 0x3F) );
      i += 2;
    }
    else if ((b0 & 0xF0) === 0xE0) {
      string += String.fromCharCode( (b0 << 12) + ((b1 & 0x3F) << 6) + (b2 & 0x3F) );
      i += 3;
    }
    else if ((b0 & 0xF8) === 0xF0) {
      string += String.fromCharCode( (b0 << 18) + ((b1 & 0x3F) << 12) + ((b2 & 0x3F) << 6) + (b3 & 0x3F) );
      i += 4;
    }
    else {
      throw new Error('UTF-8 Encoding error!');
    }

    if (string.length >= 4 && string.substring(string.length - 4) === "\r\n\r\n") {
      break;
    }
  }
  if (i < buffer_length) {
    new_buffer = buffer.subarray(i);
  }
  var [message, seq] = parseHead(string);
  message.body = new_buffer;

  return [message, seq];
};

export class Parser {

  static parseMessage(raw) {
    var defer = {}, promise = new Promise((res,rej) => { defer.resolve = res; defer.reject = rej; });
    try {
      if ( raw instanceof ArrayBuffer ) {
        defer.resolve(parseMessageBuffer(raw));
      }
      else if ( typeof raw === 'string' ) {
        defer.resolve(parseMessageString(raw));
      }
      else {
        defer.reject(new Error('Unable to parse ' + raw.toString() + ' of type ' + typeof raw));
      }
    }
    catch (e) {
      defer.reject(e);
    }
    return promise;
  }

  static serializeMessage(msg, seq) {
    msg.validate();
    var header = '';
    if (msg instanceof Request) {
      header = [msg.method, (msg.url === null ? '*' : msg.url.toString()), seq].join(' ');
    } else if (msg instanceof Response) {
      header = [msg.status, msg.code, seq].join(' ');
    } else if (msg instanceof Notification) {
      header = [msg.event, msg.url.toString()].join(' ');
    } else {
      throw new Error("Tried to serialize a message that is not a message");
    }

    var head = header + "\r\n" + serializeHeaderToString(msg);

    // Serialize body to string
    if (!(msg.body instanceof ArrayBuffer)) {
      return head + serializeBodyToString(msg);
    }

    // Serialize body to buffer
    var body_length = (msg.body.byteLength || msg.body.length);
    if ( body_length > 0)
      head += "\r\n";
    var headUTF8Array = stringToUTF8Array(head), head_length = headUTF8Array.length;
    var serializedMessage = new Uint8Array(new ArrayBuffer(head_length + body_length));
    var body = new Uint8Array(msg.body);
    for (var i = 0; i < head_length; i++) {
      serializedMessage[i] = headUTF8Array[i];
    }
    for (i = 0; i < body_length; i++) {
      serializedMessage[i+head_length] = body[i];
    }
    return serializedMessage;
  }

}
