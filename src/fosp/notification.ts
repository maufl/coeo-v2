// Notification class
import { Message, MessageOptions } from './message';
import { URL } from './url';

export const CREATED = "CREATED", UPDATED = "UPDATED", DELETED = "DELETED";
export var Events = [CREATED, UPDATED, DELETED];

interface NotificationOptions extends MessageOptions {
  event?: string;
  url?: URL;
}

export class Notification extends Message {
  event: string;
  url: URL;

  constructor(msg: NotificationOptions) {
    super(msg);
    this.event = msg.event || '';
    this.url = msg.url || null;
  }

  validate() {
    // Sanity check of message
    if (!(this instanceof Notification)) {
      throw new Error("This notification is no notification");
    }
    if (typeof(this.event) !== "string" || Events.indexOf(this.event) < 0) {
      throw new Error("Unknown event: " + this.event);
    }
    if (typeof this.url !== "object" || this.url === null) {
      throw new Error("Invalid request url: " + this.url);
    }
    if (typeof(this.header) !== 'object') {
      throw new Error("Invalid headers object: " + this.header);
    }
  }


  short() {
    return [this.event, this.url.toString()].join(" ");
  }

}
