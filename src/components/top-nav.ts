import {Component, NgIf} from 'angular2/angular2';
import {RouterLink} from 'angular2/router';
import {SideBar} from './side-bar';
import {fosp} from '../services/fosp';
import {User} from '../models/user';
import {Avatar} from './avatar';

@Component({
    selector: 'top-nav',
    directives: [SideBar, Avatar, NgIf, RouterLink],
    template: `
<side-bar #side-bar></side-bar>
<div class="left card-panel hide-on-small-only" style="margin: 10px; padding: 10px">
<a (click)="sideBar.show()" style="display: block; height: 24px"><i class="material-icons black-text">menu</i></a>
</div>
<div class="right hide-on-small-only" style="margin: 10px;">
<a class="card-panel" style="display: block; margin: 0; padding: 10px; width: 63px; height: 63px" *ng-if="!currentUser" [router-link]="['/Login']">
<i class="material-icons" style="font-size: 43px;">account_circle</i>
</a>
<a *ng-if="currentUser" [router-link]="['/User', {id: currentUser.id}]">
<avatar [user]="currentUser" [size]="'63px'" />
</a>
</div>
<nav class="hide-on-med-and-up">
<div class="nav-wrapper teal">
<ul>
<li><a class="button-collapse" (click)="sideBar.show()"><i class="material-icons">menu</i></a></li>
</ul>
<a class="brand-logo">Coeo</a>
<ul class="right hide-on-med-and-down">
<li>
<a *ng-if="!currentUser" [router-link]="['/Login']">
<i class="material-icons">account_circle</i>
</a>
<a *ng-if="currentUser" [router-link]="['/User', {id: currentUser.id}]">
<i style="padding-top: 10px;"><avatar [user]="currentUser" [size]="'42px'" /></i>
</a>
</li>
</ul>
</div>
</nav>
`
})
export class TopNav {
    currentUser: User;

    onInit() {
        fosp.on('authenticated', () => {
            this.currentUser = fosp.currentUser;
            this.currentUser.load();
            this.currentUser.profilePicture.load();
        })
    }
}
