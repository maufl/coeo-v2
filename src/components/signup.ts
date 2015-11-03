import {Component, Inject} from 'angular2/angular2';
import {fosp} from '../services/fosp';
import {FormBuilder, Validators, FORM_DIRECTIVES, ControlGroup} from 'angular2/angular2';
import {Router, RouterLink} from 'angular2/router';

@Component({
    selector: 'signup',
    directives: [FORM_DIRECTIVES, RouterLink],
    template: `
<div class="container">
<div class="card">
<div class="card-content">
<h4>Create account</h4>
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
<a class="btn-flat" [router-link]="['/Login']">Login instead</a>
<a class="btn-flat" (click)="signup()">Signup</a>
</div>
</div>
</div>
`
})
export class Signup {
    constructor(@Inject(Router) router: Router) {
        this.router = router;
        this.loginForm = (new FormBuilder()).group({
            'username': ['', Validators.required],
            'password': ['', Validators.required]
        });
    }

    signup() {
        var {username, password} = this.loginForm.value;
        var domain = username.split('@')[1];
        fosp.open(domain).then(()=>{
            fosp.create(username, { data: { password: password }}).then(()=>{
                fosp.authenticate(username, password).then(() => {
                    return fosp.ensureExistence(username + "/soc/me/motto");
                }).then(() => {
                    return fosp.ensureExistence(username + "/soc/photos/profile");
                }).then(() => {
                    return fosp.create(username + "/soc/photos/cover", {});
                }).then(() => {
                    return fosp.ensureExistence(username + "/soc/feed/blog");
                }).then(() => {
                    return fosp.patch(username + "/soc", { acl: { others: { data: ["read"], children: ["read"]}}});
                }).then(() => {
                    return fosp.ensureExistence(username + "/cfg/groups");
                }).then(() => {
                    return fosp.create(username + "/cfg/groups/friends", { data: { name: "Friends", members: [] }});
                }).then(() => {
                    this.router.navigate(['/User', { id: username }]);
                })
            }).catch((err)=>{
                console.log(err);
            })
        })
    }
}
