//Everything message related
import { EventEmitter } from './events';

export class Message extends EventEmitter {
  constructor(msg) {
    super();
    this.header = msg.header || {};
    this.body = msg.body || null;
  }

  toString() {
    if (this.body instanceof ArrayBuffer || this.body instanceof Uint8Array)
      return this.short() + ' :: [binary data]';
    return this.short() + ' :: ' + JSON.stringify(this.body);
  }
}
