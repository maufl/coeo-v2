import {Component, Input} from 'angular2/angular2';
import {Avatar} from './avatar';

@Component({
    selector: 'post',
    directives: [Avatar],
    template: `
<div class="card">
<div class="card-content">
<avatar [user]="post.owner" [size]="'42px'"></avatar>
{{post.text}}
</div>
</div>
`
})
export class Post {
    @Input() post: Object;
}
