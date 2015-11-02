import {Component, ElementRef, Inject} from 'angular2/angular2';
import {fosp} from '../services/fosp';
import {FormBuilder, Validators, FORM_DIRECTIVES, ControlGroup} from 'angular2/angular2';
import {Router, RouterLink} from 'angular2/router';

@Component({
    selector: 'login',
    directives: [FORM_DIRECTIVES, RouterLink],
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
<a class="btn-flat" [router-link]="['/Signup']">Create new account</a>
<a class="btn-flat" (click)="login()">Login</a>
</div>
</div>
</div>
`
})
export class Login {
    constructor(private element:ElementRef, @Inject(Router) router: Router) {
        this.router = router;
        var username = localStorage.getItem('coeo.username');
        var password = localStorage.getItem('coeo.password');
        this.loginForm = (new FormBuilder()).group({
            'username': [ username || '', Validators.required],
            'password': [ password || '', Validators.required]
        });
    }

    login() {
        var {username, password} = this.loginForm.value;
        var domain = username.split('@')[1];
        fosp.open(domain).then(()=>{
            fosp.authenticate(username, password).then(()=>{
                localStorage.setItem('coeo.username', username);
                localStorage.setItem('coeo.password', password);
                this.router.navigate(['/User', { id: username }]);
            }).catch((err)=>{
                console.log(err);
            })
        })
    }
}
