import {
  Component,
  FORM_DIRECTIVES,
  ControlGroup,
  FormBuilder
} from 'angular2/angular2';

import {
  RouteParams
} from 'angular2/router';

import {
  User
} from '../models/user';

@Component({
  selector: 'settings',
  directives: [FORM_DIRECTIVES],
  template: `
<div class="responsive-container">
<div class="card">
<div class="card-content">
<h4>Settings</h4>
<form [ng-form-model]="settings">
<div>
<input ng-control="fullName" />
</div>
<div>
<input ng-control="motto" />
</div>
</form>
<a class="btn right" (click)="save()">Save</a>
</div>
</div>
</div>
`
})
export class Settings {
  user: User;
  settings: ControlGroup;

  constructor(routeParams: RouteParams) {
    this.user = User.get(routeParams.params['id']);
    this.user.load();
    this.settings = (new FormBuilder()).group({
      'fullName': [this.user.fullName],
      'motto': [this.user.motto]
    })
  };
}
