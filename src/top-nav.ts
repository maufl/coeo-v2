import {Component, View} from 'angular2/angular2';
import {SideBar} from './side-bar';
import {LoginModal} from './login-dialog';

@Component({ selector: 'top-nav' })
@View({
   template: `<nav>
<side-bar #side-bar></side-bar>
             <div class="nav-wrapper teal">
<ul class="left">
<li><a href="#" (click)="sideBar.show(); $event.preventDefault(); $event.stopPropagation();"><i class="material-icons">menu</i></a></li>
</ul>
                  <a href="#" class="brand-logo">Coeo</a>
                  <ul class="right hide-on-med-and-down">
                  <li><a href="#" (click)="loginmodal.open(); $event.preventDefault()"><i class="material-icons">account_circle</i></a></li>
                  <login-modal #loginmodal ></login-modal>
                  </ul>
             </div>
   </nav>`,
    directives: [LoginModal, SideBar]
})
export class TopNav {
}
