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
<div class="container">
<div class="row">
<div class="col s12">
<cover-photo *ng-if="user" [user]="user"></cover-photo>
</div>
<div class="col s12">
<feed *ng-if="user" [userid]="user.id" [feed-name]="'blog'"></feed>
</div>
</div>
</div>
`
})
export class UserView {
    user: User;

    constructor(routeParams: RouteParams) {
        this.user = User.get(routeParams.params.id);
        this.user.load();
    }
}
