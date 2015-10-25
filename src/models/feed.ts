import {fosp} from '../services/fosp';
import {Post} from './post';

export class Feed {
    url: string;
    title: string;
    description: string;
    posts: Array = [];

    private constructor(url: string) {
        this.url = url;
    }

    static get(url: string) {
        var feed = new Feed(url);
        feed.load();
        return feed;
    }

    load() {
        return fosp.get(this.url).then((object) => {
            this.title = object.data.title;
            this.description = object.data.description;
            return fosp.list(this.url)
        }).then((list) => {
            list.forEach((postName) => {
                this.posts.push(Post.get(this.url + '/' + postName));
            })
            return true;
        })
    }
}
