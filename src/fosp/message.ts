//Everything message related
import { EventEmitter } from './events';

interface HeaderMap {
  [key: string]: string
}

export interface MessageOptions {
  header?: HeaderMap,
  body?: (Object|ArrayBuffer)
}

export class Message extends EventEmitter {
  header: HeaderMap;
  body: (Object|ArrayBuffer);

  constructor(msg: MessageOptions) {
    super();
    this.header = msg.header || {};
    this.body = msg.body || null;
  }

  toString() {
    if (this.body instanceof ArrayBuffer || this.body instanceof Uint8Array)
      return this.short() + ' :: [binary data]';
    return this.short() + ' :: ' + JSON.stringify(this.body);
  }

  short() {
    throw new Error('short() must be implemented by child class');
  }
}
