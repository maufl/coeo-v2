import {Component, NgIf} from 'angular2/angular2';
import {SideBar} from './side-bar';
import {LoginModal} from './login-dialog';
import {fosp} from '../services/fosp';
import {User} from '../models/user';

@Component({
    selector: 'top-nav',
    directives: [LoginModal, SideBar, NgIf],
    template: `
<nav>
<side-bar #side-bar></side-bar>
<div class="nav-wrapper teal">
<ul class="left">
<li><a (click)="sideBar.show()"><i class="material-icons">menu</i></a></li>
</ul>
<a href="#" class="brand-logo">Coeo</a>
<ul class="right hide-on-med-and-down">
<li><a (click)="loginmodal.open()">
<i *ng-if="!currentUser" class="material-icons">account_circle</i>
<div *ng-if="currentUser" [style.background-image]="'url('+currentUser.profilePicture.image.src+')'" class="card-panel" style="height: 42px; width: 42px; background-size: cover;"></div>
</a></li>
<login-modal #loginmodal ></login-modal>
</ul>
</div>
</nav>
`
})
export class TopNav {
    currentUser: User;

    onInit() {
        fosp.on('userChanged', () => {
            this.currentUser = fosp.currentUser;
            this.currentUser.profilePicture.load();
        })
    }
}
