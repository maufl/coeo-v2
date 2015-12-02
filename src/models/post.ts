import {fosp} from '../services/fosp';
import {User} from './user';
import {Base} from './base';

export class Post extends Base{
    text: string;

    constructor(id: string) {
        super(id);
    }

    static create(id: string, text: string) {
        return fosp.create(id, { data: text });
    }

    load() {
        return super.load().then((object) => {
            this.text = object.data;
            return true;
        })
    }
}
