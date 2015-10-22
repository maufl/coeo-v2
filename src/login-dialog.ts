import {Component, ElementRef, Inject} from 'angular2/angular2';
import {fosp} from './services/fosp';
import {FormBuilder, Validators, FORM_DIRECTIVES, ControlGroup} from 'angular2/angular2';
import {Router} from 'angular2/router';

@Component({
    selector: 'login-modal',
    directives: [FORM_DIRECTIVES],
    template: `
<div class="modal" style="width: 400px;">
<div class="modal-content">
<h4>Sign in</h4>
<form [ng-form-model]="loginForm">
<div>
<input ng-control="username" type="email" placeholder="Your username" />
</div>
<div>
<input ng-control="password" type="password" placeholder="Your password" />
</div>
</form>
</div>
<div class="modal-footer">
<a href="#!" class="modal-action btn-flat" (click)="login()">Login</a>
</div>
</div>
`
})
export class LoginModal {
    constructor(private element:ElementRef, @Inject(Router) router: Router) {
        this.router = router;
        this.loginForm = (new FormBuilder()).group({
            'username': ['', Validators.required],
            'password': ['', Validators.required]
        });
        this.modal = element.nativeElement.children[0];
    }

    open() {
        $(this.modal).openModal();
    }

    login() {
        console.debug(this.loginForm.value);
        var {username, password} = this.loginForm.value;
        fosp.open('localhost').then(()=>{
            fosp.authenticate(username, password).then(()=>{
                $(this.modal).closeModal();
                this.router.navigate(['/User', { id: username }]);
            }).catch((err)=>{
                console.log(err);
            })
        })
    }
}
