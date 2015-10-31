import {Component, Input} from 'angular2/angular2';
import {Avatar} from './avatar';

@Component({
    selector: 'post',
    directives: [Avatar],
    template: `
<div class="card">
<div class="card-content">
<div style="display: flex; flex-direction: row">
<avatar [user]="post.owner" [size]="'42px'"></avatar>
<div style="flex: 1; margin-left: 5px;">
<h5 style="margin:0">{{post.owner.fullName}}</h5>
<small>{{post.created | date:'medium'}}</small>
</div>
</div>
{{post.text}}
</div>
</div>
`
})
export class Post {
    @Input() post: Object;
}
