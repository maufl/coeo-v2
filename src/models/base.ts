import {fosp} from '../services/fosp';
import {cache} from '../services/cache';
import {User} from './user';

export class Base {
    id: string;
    created: Date;
    updated: Date;
    owner: User;
    $loaded: bool = false;
    $loading: bool = false;

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

    ensureExistence() {
        return fosp.ensureExistence(this.id);
    }

    load() {
        if (this.$loading || this.$loaded) {
            return Promise.reject();
        }
        this.$loading = true;
        return fosp.get(this.id).then((obj) => {
            this.owner = User.get(obj.owner);
            this.created = new Date(obj.btime);
            this.updated = new Date(obj.mtime);
            this.$loading = false;
            this.$loaded = true;
            return obj;
        }).catch((error) => {
            this.$loading = false;
            return Promise.reject(error);
        })
    }
}
