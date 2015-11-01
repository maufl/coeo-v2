import {fosp} from '../services/fosp';
import {User} from './user';

export class Post {
    url: string;
    owner: User;
    created: Date;
    updated: Date;
    text: string;

    private constructor(url: string) {
        this.url = url;
    }

    static get(url: string) {
        var post = new Post(url);
        post.load();
        return post;
    }

    static create(url: string, text: string) {
        return fosp.create(url, { data: text });
    }

    load() {
        fosp.get(this.url).then((object) => {
            this.owner = User.get(object.owner);
            this.created = new Date(object.btime);
            this.updated = new Date(object.mtime);
            this.text = object.data;
            return true;
        })
    }
}