import {Component, View, NgIf} from 'angular2/angular2';
import {RouteParams} from 'angular2/router';
import {fosp} from './services/fosp';
import {CoverPhoto} from './cover-photo';

@Component({
    selector: 'user-view',
    viewInjector: [RouteParams]
})
@View({
    template: `
<div class="container">
<div class="row">
<div class="col s12">
<cover-photo *ng-if="user" [userid]="userId" [username]="user.fullName"></cover-photo>
</div>
</div>
<div class="row">
</div>
</div>
`,
    directives: [NgIf, CoverPhoto]
})
export class UserView {
    user: Object;
    userId: string;

    constructor(routeParams: RouteParams) {
        this.userId = routeParams.params.id;
        this.getUser();
    }

    getUser() {
        fosp.open('localhost').then(() => {
            return fosp.authenticate('alice@localhost.localdomain', 'test1234');
        }).then(() => {
            return fosp.getUser(this.userId);
        }).then((user) => {
            this.user = user;
        }).catch((error) => {
            Materialize.toast(error, 4000);
        })
    }
}
