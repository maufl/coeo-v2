import {Component, Input, NgFor} from 'angular2/angular2';
import {fosp} from '../services/fosp';
import {Feed} from '../models/feed';
import {Post} from './post';

@Component({
    selector: 'feed',
    directives: [Post, NgFor],
    template: `
<post *ng-for="#post of feed.posts" [post]="post"></post>
`
})
export class Feed {
    @Input() userid: string;
    @Input() feedName: string;
    feed: Feed;

    onInit() {
        this.feed = Feed.get(this.userid + "/soc/feed/" + this.feedName);
    }
}
