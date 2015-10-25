import {Component, Input} from 'angular2/angular2';

@Component({
    selector: 'post',
    template: `
<div class="card">
{{post.text}}
</div>
`
})
export class Post {
    @Input() post: Object;
}
