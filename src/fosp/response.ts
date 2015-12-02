// Response class
import { Message } from './message';

export const SUCCEEDED = "SUCCEEDED", FAILED = "FAILED";
export var Statuses = [SUCCEEDED, FAILED];

export class Response extends Message {
  constructor(msg) {
    super(msg);
    this.status = msg.status || '';
    this.code = msg.code || 0;
  }

  validate() {
    // Sanity check of message
    if (!this instanceof Response) {
      throw new Error("This response is no response!");
    }
    if (typeof(this.status) !== "string" || Statuses.indexOf(this.status) < 0) {
      throw new Error("Unknown response" + this.response);
    }
    if (typeof(this.code) !== "number" || this.code <= 0) {
      throw new Error("Unknown response status: " + this.status);
    }
    if (typeof(this.header) !== 'object') {
      throw new Error("Invalid header object: " + this.header);
    }
  }

  short() {
    return [this.status, this.code].join(" ");
  }

}
