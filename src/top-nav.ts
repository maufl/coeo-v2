import {Component, View} from 'angular2/angular2';
import {LoginModal} from './login-dialog';

@Component({ selector: 'top-nav' })
@View({
   template: `<nav>
             <div class="nav-wrapper teal">
<ul class="left">
<li><a href="#"><i class="material-icons">menu</i></a></li>
</ul>
                  <a href="#" class="brand-logo">Coeo</a>
                  <ul class="right hide-on-med-and-down">
                  <li><a href="#" (click)="loginmodal.open()"><i class="material-icons">face</i></a></li>
                  <login-modal #loginmodal ></login-modal>
                  </ul>
             </div>
   </nav>`,
   directives: [LoginModal]
})
export class TopNav {
}
