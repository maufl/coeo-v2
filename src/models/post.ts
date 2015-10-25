import {fosp} from '../services/fosp';

export class Post {
    url: string;

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
            this.owner = object.owner;
            this.text = object.data;
            return true;
        })
    }
}
