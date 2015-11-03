import {Component, Input, NgFor, NgIf} from 'angular2/angular2';
import {FORM_DIRECTIVES} from 'angular2/angular2';
import {fosp} from '../services/fosp';
import {Feed} from '../models/feed';
import {Post} from './post';
import {Post as PostModel} from '../models/post';

@Component({
    selector: 'feed',
    directives: [Post, NgFor, NgIf, FORM_DIRECTIVES],
    template: `
<div class="card" *ng-if="canPost">
<div class="card-content">
<h5>Post something</h5>
<textarea class="materialize-textarea" [(ng-model)]="newPostText"></textarea>
</div>
<div class="card-action">
<a (click)="submitPost()">Post</a>
</div>
</div>
<post *ng-for="#post of feed.posts" [post]="post"></post>
`
})
export class Feed {
    @Input() userid: string;
    @Input() feedName: string;
    feed: Feed;
    newPostText: string = "";

    onInit() {
        this.feed = Feed.get(this.userid + "/soc/feed/" + this.feedName);
        this.feed.load();
    }

    get canPost() {
        return !!this.feed.owner && this.feed.owner.isCurrentUser();
    }

    submitPost() {
        var date = new Date();
        var teaser = this.newPostText.replace('!@#$%^&*(){}[]\'"?|\/,.<>;:','').split(/\s+/).slice(0, 3).join('-');
        var title = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}-${teaser}`;
        PostModel.create(this.userid+"/soc/feed/"+this.feedName+"/"+title, this.newPostText).then(() => {
            this.feed.reload();
            this.newPostText = "";
        })
    }
}
