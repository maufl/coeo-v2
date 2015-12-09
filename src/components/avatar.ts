import {Component, Input, NgClass} from 'angular2/angular2';
import {User} from '../models/user';

@Component({
    selector: 'avatar',
    directives: [NgClass],
    template: `
<div [style.height]="size"
     [style.width]="size" [ng-class]="{'z-depth-1': shadow}" style="border-radius: 2px; padding: 2px; background: white;" [style.border]="shadow ? '' : '1px solid lightgrey'">
<div [style.background-image]="'url('+user.profilePicture.image.src+')'" style="border-radius: 1px; background-size: cover; height: 100%; width: 100%;">
</div>
</div>
`
})
export class Avatar {
    @Input() size: string;
    @Input() user: User;
    @Input() shadow: boolean = true;

    onInit() {
        this.user.profilePicture.load();
    }
}
