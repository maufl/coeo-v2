import {fosp} from '../services/fosp';
import {cache} from '../services/cache';
import {Image} from './image';

export class User {
    id: string;
    motto: string;
    fullName: string;
    profilePicture: Image;
    coverPicture: Image;

    constructor(id: string) {
        this.id = id;
        this.profilePicture = new Image(this.id + '/soc/photos/profile');
        this.coverPicture = new Image(this.id + '/soc/photos/cover');
    }

    static get(id: string): Promise {
        var user = cache.get(User, id);
        if (!user) {
            user = new User(id);
            cache.set(user);
        }
        user.load();
        return user;
    }

    load() {
        return fosp.get(this.id + "/soc/me").then((object) => {
            this.fullName = object.data.fullName;
            fosp.get(this.id + "/soc/me/motto").then((object) => {
                this.motto = object.data;
            });
            return this;
        });
    }
}
