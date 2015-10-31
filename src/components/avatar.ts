import {Component, Input} from 'angular2/angular2';
import {User} from '../models/user';

@Component({
    selector: 'avatar',
    template: `
<div [style.background-image]="'url('+user.profilePicture.image.src+')'" [style.height]="size" [style.width]="size" class="z-depth-1" style="border-radius: 2px; background-size: cover;">
</div>
`
})
export class Avatar {
    @Input() size: string;
    @Input() user: User;
}
