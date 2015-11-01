import {Component, Input, NgIf} from 'angular2/angular2';
import {User} from '../models/user';

@Component({
    selector: "cover-photo",
    directives: [NgIf],
    template: `
<div class="card">
<div (dragover)="prevent($event)" (drop)="updateProfilePicture($event)" *ng-if="user.profilePicture.image.src" class="card-panel z-depth-2" style="z-index: 1; position: absolute; top: 0; right: 0; margin: 20px; height: 100px; width: 100px; background-position: center center; background-size: cover;" [style.background-image]="'url('+user.profilePicture.image.src+')'">
</div>
<div (dragover)="prevent($event)" (drop)="updateCoverPicture($event)" *ng-if="user.coverPicture.image.src" [style.background-image]="'url('+user.coverPicture.image.src+')'" class="card-image" style="background-size: cover; background-position: center center; height: 200px; overflow: hidden;">
<span class="card-title" style="color: black;">{{user.fullName}}</span>
</div>
<div class="card-content">
<h4 *ng-if="!user.coverPicture.image.src">{{user.fullName}}</h4>
<blockquote *ng-if="user.motto" style="margin: 0;">{{user.motto}}</blockquote>
</div>
</div>
`
})
export class CoverPhoto {
    @Input() user: User;

    onInit() {
        this.user.coverPicture.load();
        this.user.profilePicture.load();
    }

    updateProfilePicture(event) {
        this.prevent(event);
        if (!(event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length === 1)) {
            return;
        }
        var file = event.dataTransfer.files[0];
        this.user.profilePicture.write(file);
    }

    updateCoverPicture(event) {
        this.prevent(event);
        if (!(event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length === 1)) {
            return;
        }
        var file = event.dataTransfer.files[0];
        this.user.coverPicture.write(file);
    }

    prevent(event) {
        event.preventDefault();
        event.stopPropagation();
    }
}
