import {fosp} from '../services/fosp';

export class User {
    id: string;
    motto: string;
    fullName: string;

    constructor(id: string) {
        this.id = id;
    }

    static get(id: string) {
        var user = new User(id);
        return user.load();
    }

    load() {
        return fosp.get(this.id).then(() => {
            fosp.get(this.id + "/soc/me").then((object) => {
                this.fullName = object.data.fullName;
            });
            fosp.get(this.id + "/soc/me/motto").then((object) => {
                this.motto = object.data;
            });
            return this;
        });
    }
}
