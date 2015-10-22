import {Component, NgIf} from 'angular2/angular2';
import {SideBar} from './side-bar';
import {LoginModal} from './login-dialog';
import {fosp} from './services/fosp';

@Component({
    selector: 'top-nav',
    directives: [LoginModal, SideBar, NgIf],
    template: `
<nav>
<side-bar #side-bar></side-bar>
<div class="nav-wrapper teal">
<ul class="left">
<li><a href="#" (click)="sideBar.show(); $event.preventDefault(); $event.stopPropagation();"><i class="material-icons">menu</i></a></li>
</ul>
<a href="#" class="brand-logo">Coeo</a>
<ul class="right hide-on-med-and-down">
<li><a href="#" (click)="loginmodal.open(); $event.preventDefault()">
<i *ng-if="!profilePicture" class="material-icons">account_circle</i>
<div *ng-if="profilePicture" [style.background-image]="'url('+profilePicture.src+')'" class="card-panel" style="height: 42px; width: 42px; background-size: cover;"></div>
</a></li>
<login-modal #loginmodal ></login-modal>
</ul>
</div>
</nav>
`
})
export class TopNav {
    profilePicture: Image = null;

    onInit() {
        if (fosp.currentUser) {
            this.loadProfilePicture();
        }
        fosp.on('authenticated', this.loadProfilePicture.bind(this));
    }

    loadProfilePicture() {
        fosp.loadImage(fosp.currentUser + "/soc/photos/profile").then((img) => {
            this.profilePicture = img;
        })
    }
}
