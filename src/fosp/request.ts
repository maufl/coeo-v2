// Request class
import { Message, MessageOptions } from './message';
import { URL } from './url';

export const OPTIONS = "OPTIONS",
AUTH = "AUTH",
GET = "GET",
LIST = "LIST",
CREATE = "CREATE",
PATCH = "PATCH",
DELETE = "DELETE",
READ = "READ",
WRITE = "WRITE";

export var Methods = [OPTIONS, AUTH, GET, LIST, CREATE, PATCH, DELETE, READ, WRITE];

export interface RequestOptions extends MessageOptions {
  method?: string,
  url?: URL
}

export class Request extends Message {
  method: string;
  url: URL;

  constructor(msg: RequestOptions) {
    super(msg);
    this.method = msg.method || '';
    this.url = msg.url || null;
  }

  validate() {
    // Sanity check of message
    if (!(this instanceof Request)) {
      throw new Error("This request is no request!");
    }
    if (typeof(this.method) !== "string" || Methods.indexOf(this.method) < 0) {
      throw new Error("Unknown request: " + this.method);
    }
    if (this.method === WRITE && this.body !== null && ! (this.body instanceof ArrayBuffer)) {
      throw new Error("Invalid body for WRITE request: " + typeof this.body);
    }
    if (typeof this.url !== "object") {
      throw new Error("Invalid request url: " + this.url);
    }
    if (typeof(this.header) !== 'object') {
      throw new Error("Invalid headers object: " + this.header);
    }
  }

  short() {
    var url = this.url ? this.url.toString() : '*';
    return [this.method, url].join(" ");
  }

}
