import {Component, Input, NgIf} from 'angular2/angular2';
import {RouterLink} from 'angular2/router';
import {Avatar} from './avatar';
import {Post} from '../models/post';
import {User} from '../models/user';

@Component({
    selector: 'post',
    directives: [Avatar, NgIf, RouterLink],
    template: `
<div class="card">
<div class="card-content">
<div *ng-if="post.owner" style="display: flex; flex-direction: row">
<avatar [user]="post.owner" [size]="'42px'"></avatar>
<div style="flex: 1; margin-left: 5px;">
<h5 style="margin: 0;" [router-link]="['/User', { id: post.owner.id}]">{{post.owner.fullName}}</h5>
<small>{{post.created | date:'medium'}}</small>
</div>
</div>
{{post.text}}
</div>
</div>
`
})
export class Post {
    @Input() post: Post;
}
