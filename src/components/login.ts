import {Component, ElementRef, Inject} from 'angular2/angular2';
import {fosp} from '../services/fosp';
import {FormBuilder, Validators, FORM_DIRECTIVES, ControlGroup} from 'angular2/angular2';
import {Router} from 'angular2/router';

@Component({
    selector: 'login',
    directives: [FORM_DIRECTIVES],
    template: `
<div class="container">
<div class="card">
<div class="card-content">
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
<div class="card-action">
<a class="btn-flat" (click)="login()">Login</a>
</div>
</div>
</div>
`
})
export class Login {
    constructor(private element:ElementRef, @Inject(Router) router: Router) {
        this.router = router;
        this.loginForm = (new FormBuilder()).group({
            'username': ['bob@localhost.localdomain', Validators.required],
            'password': ['test1234', Validators.required]
        });
    }

    login() {
        var {username, password} = this.loginForm.value;
        fosp.open('localhost').then(()=>{
            fosp.authenticate(username, password).then(()=>{
                this.router.navigate(['/User', { id: username }]);
            }).catch((err)=>{
                console.log(err);
            })
        })
    }
}
