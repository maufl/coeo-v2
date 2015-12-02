import {Component, NgIf} from 'angular2/angular2';
import {RouteParams} from 'angular2/router';
import {CoverPhoto} from './cover-photo';
import {Feed} from './feed';
import {User} from '../models/user';

@Component({
    selector: 'user-view',
    viewInjector: [RouteParams],
    directives: [NgIf, CoverPhoto, Feed],
    template: `
<div class="responsive-container">
<cover-photo *ng-if="user" [user]="user"></cover-photo>
<feed *ng-if="user" [userid]="user.id" [feed-name]="'blog'"></feed>
</div>
`
})
export class UserView {
    user: User;

    constructor(routeParams: RouteParams) {
        this.user = User.get(routeParams.params['id']);
        this.user.load();
    }
}
