import {Component, View, NgIf} from 'angular2/angular2';
import {RouteParams} from 'angular2/router';
import {fosp} from './services/fosp';

@Component({
    selector: 'user-view',
    viewInjector: [RouteParams]
})
@View({
    template: `
<span *ng-if="error">{{ error }}</span>
<h1 *ng-if="user">{{ user.fullName }}</h1>
`,
    directives: [NgIf]
})
export class UserView {
    user: Object;
    userId: string;
    error: string;

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
            this.error = error;
        })
    }
}
