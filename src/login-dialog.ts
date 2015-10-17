import {Component, View, ElementRef} from 'angular2/angular2';
import {fosp} from './services/fosp';
import {FormBuilder, Validators, FORM_DIRECTIVES, ControlGroup} from 'angular2/angular2';

@Component({ selector: 'login-modal' })
@View({
    template: `
<div class="modal">
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
`,
    directives: [FORM_DIRECTIVES]
})
export class LoginModal {
    constructor(private element:ElementRef) {
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
            }).catch((err)=>{
                console.log(err);
            })
        })
    }
}
