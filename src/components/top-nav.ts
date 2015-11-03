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
<div class="navbar-fixed">
<nav>
<side-bar #side-bar></side-bar>
<div class="nav-wrapper teal">
<ul class="left">
<li><a class="button-collapse hide-on-med-and-up" (click)="sideBar.show()"><i class="material-icons">menu</i></a></li>
<li><a class="hide-on-small-only" (click)="sideBar.show()"><i class="material-icons">menu</i></a></li>
</ul>
<a href="#" class="brand-logo">Coeo</a>
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
</div>
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
