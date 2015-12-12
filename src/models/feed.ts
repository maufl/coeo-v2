import {fosp} from '../services/fosp';
import {Post} from './post';
import {Base} from './base';

export class Feed extends Base {
    title: string;
    description: string;
    posts: Array<Post> = [];

    constructor(id: string) {
        super(id);
    }

    load() {
        return super.load().then((object) => {
            if (typeof object.data === 'object') {
                this.title = object.data.title;
                this.description = object.data.description;
            }
            return fosp.list(this.id).then((list: Array<string>) => {
                this.posts = [];
                list.forEach((postName) => {
                    this.posts.push(Post.get(this.id + '/' + postName));
                });
                return Promise.resolve(object)
            })
        })
    }
}
