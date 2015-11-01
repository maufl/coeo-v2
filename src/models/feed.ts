import {fosp} from '../services/fosp';
import {Post} from './post';
import {Base} from './base';

export class Feed extends Base {
    title: string;
    description: string;
    posts: Array = [];

    private constructor(id: string) {
        super(id);
    }

    load() {
        return super.load().then((object) => {
            this.title = object.data.title;
            this.description = object.data.description;
            return fosp.list(this.id)
        }).then((list) => {
            this.posts = [];
            list.forEach((postName) => {
                this.posts.push(Post.get(this.id + '/' + postName));
            })
            return true;
        })
    }
}
