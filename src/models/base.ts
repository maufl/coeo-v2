import {fosp} from '../services/fosp';
import {cache} from '../services/cache';
import {User} from './user';

export class Base {
    id: string;
    created: Date;
    updated: Date;
    owner: User;
    $isLoaded: bool = false;
    $isLoading: bool = false;

    constructor(id: string) {
        this.id = id;
    }

    static get(id: string) {
        var obj = cache.get(this, id);
        if (!obj) {
            obj = new this(id);
            cache.set(obj);
        }
        return obj;
    }

    load() {
        if (this.$isLoading || this.$isLoaded) {
            return Promise.reject();
        }
        this.$isLoading = true;
        return fosp.get(this.id).then((obj) => {
            this.owner = User.get(obj.owner);
            this.created = new Date(obj.btime);
            this.updated = new Date(obj.mtime);
            this.$isLoading = false;
            this.$isLoaded = true;
            return obj;
        }).catch((error) => {
            this.$isLoading = false;
        })
    }
}
