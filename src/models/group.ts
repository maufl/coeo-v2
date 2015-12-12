import {Base} from './base';
import {User} from './user';

export class Group extends Base {
    name: string;
    members: Array<User> = [];

    constructor(id: string) {
        super(id);
    }

    load() {
        return super.load().then((object) => {
            this.name = object.data.name;
            this.members = object.data.members.map((id: string) => { return User.get(id); });
            return Promise.resolve(object);
        })
    }
}
