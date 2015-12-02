import {Component, Input, NgFor, NgIf} from 'angular2/angular2';
import {FORM_DIRECTIVES} from 'angular2/angular2';
import {fosp} from '../services/fosp';
import {Feed as FeedModel} from '../models/feed';
import {Post} from './post';
import {Post as PostModel} from '../models/post';

@Component({
    selector: 'feed',
    directives: [Post, NgFor, NgIf, FORM_DIRECTIVES],
    template: `
<div class="card" *ng-if="canPost">
<div class="card-content" style="display: flex; flex-direction: row; align-items: flex-end;">
<div class="input-field" style="margin-top: 0; flex: 1;">
<label>Write something ...</label>
<textarea class="materialize-textarea" style="padding: 0; margin: 0; resize: vertical;" [(ng-model)]="newPostText"></textarea>
</div>
<a class="btn right" (click)="submitPost()" style="margin-left: 10px;">
Post
<i class="material-icons right">send</i>
</a>
</div>
</div>
<div class="card-list">
<post style="flex-grow: 1; display: block; min-width: 300px; max-widht: 500px;" *ng-for="#post of feed.posts" [post]="post"></post>
</div>
`
})
export class Feed {
    @Input() userid: string;
    @Input() feedName: string;
    feed: FeedModel;
    newPostText: string = "";

    onInit() {
        this.feed = FeedModel.get(this.userid + "/soc/feed/" + this.feedName);
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
