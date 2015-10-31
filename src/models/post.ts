import {fosp} from '../services/fosp';
import {User} from './user';

export class Post {
    url: string;
    owner: User;

    private constructor(url: string) {
        this.url = url;
    }

    static get(url: string) {
        var post = new Post(url);
        post.load();
        return post;
    }

    load() {
        fosp.get(this.url).then((object) => {
            this.owner = User.get(object.owner);
            this.text = object.data;
            return true;
        })
    }
}
