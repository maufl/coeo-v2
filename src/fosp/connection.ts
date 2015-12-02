// This object type models a fosp connection
import { EventEmitter } from './events';
import { Request } from './request';
import { Response } from './response';
import { Notification } from './notification';
import { Parser } from './parser';

/* global Promise */

export class Connection extends EventEmitter {
  constructor(ws) {
    super();
    this.ws = ws;
    this.currentSeq = 1;
    this.pendingRequests = {};
    this.requestTimeout = 15000;

    this.ws.onmessage = (message) => {
      var data = message.binaryData || message.utf8Data || message.data;
      Parser.parseMessage(data).then((parsed) => {
        var [msg, seq] = parsed;
        console.debug("fosp: received message ", seq, msg.short(), msg.header, msg.body);
        this.emit('message', msg, seq);
      }).catch((err) => {
        console.error(err);
      });
    };
    this.ws.onclose = (ev) => { this.emit('close', ev.code, ev.reason); };
    this.ws.onerror = (err) => { this.emit('error', err); };

    this.on('message', (msg, seq) => {
      if (msg instanceof Request) {
        this.emit('request', msg, seq);
      } else if (msg instanceof Response) {
        this.emit('response', msg, seq);
      } else if (msg instanceof Notification) {
        this.emit('notification', msg);
      } else {
        console.warn('fosp: recieved unknow type of message');
        console.debug(msg);
      }
    });

    this.on('response', (msg, seq) => {
      var defer = this.pendingRequests[seq];
      if (typeof defer !== 'undefined') {
        clearTimeout(defer.timeoutHandle);
        delete this.pendingRequests[seq];
        defer.resolve(msg);
      }
    });

    this.on('close', (code, reason) => {
      console.info('Connection closed, code ' + code + ': ' + reason);
    });

    this.on('error', (err) => {
      console.error('fosp: fatal! unrecoverable error occured on connection');
      console.error(err);
    });
  }

  static open(options) {
    var scheme = options.scheme || 'wss', host = options.host, port = options.port || 1337;
    var defer = {};
    var p = new Promise((res, rej) => { defer.resolve = res; defer.reject = rej; });
    var ws = new WebSocket(scheme + '://' + host + ':' + port);
    ws.binaryType = 'arraybuffer';
    ws.onopen = () => {
      defer.resolve(new Connection(ws));
    };
    ws.onerror = () => {
      defer.reject();
    };
    return p;
  }

  isOpen() {
    return this.ws.readyState === WebSocket.OPEN;
  }

  sendMessage(msg, seq) {
    console.debug("fosp: sending message ", seq, msg.short(), msg.header, msg.body);
    try {
      var raw = Parser.serializeMessage(msg, seq);
      this.ws.send(raw);
    }
    catch(e) {
      console.error(e);
    }
  }

  close() {
    this.ws.close();
  }

  // Convinience for sending requests
  sendRequest(req) {
    var defer = {}, promise = new Promise((res,rej) => { defer.resolve = res; defer.reject = rej; });
    var seq = this.currentSeq;
    this.currentSeq++;
    this.pendingRequests[seq] = defer;
    defer.timeoutHandle = setTimeout(() => {
      delete this.pendingRequests[seq];
      defer.reject('timeout');
    }, this.requestTimeout);
    this.sendMessage(req, seq);
    return promise;
  }
}
