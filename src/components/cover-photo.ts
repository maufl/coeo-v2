import {Component, Input, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';
import {User} from '../models/user';
import {Avatar} from './avatar';

@Component({
    selector: "cover-photo",
    directives: [FORM_DIRECTIVES, NgIf, Avatar],
    template: `
<div class="card">
<avatar (dragover)="prevent($event)" (drop)="updateProfilePicture($event)" [size]="'100px'" [user]="user" style="z-index: 1; position: absolute; top: 0; right: 0; margin: 20px;"></avatar>
<div (dragover)="prevent($event)" (drop)="updateCoverPicture($event)" [style.background-image]="'url('+user.coverPicture.image.src+')'" class="card-image" style="background-size: cover; background-position: center center; height: 200px; overflow: hidden;">
<span class="card-title" style="color: black; text-shadow: 0px 0px 4px white;">{{user.fullName}}</span>
</div>
<div class="card-content">
<i class="material-icons right activator" *ng-if="user.isCurrentUser()">more_vert</i>
<blockquote style="margin: 0; display: inline;" class="clearfix">{{user.motto}}</blockquote>
</div>
<div class="card-reveal" *ng-if="user.isCurrentUser()">
<span class="card-title black-text">Settings<i class="material-icons right">close</i></span>
<div class="input-field">
<label>
Full name
</label>
<input type="text" [(ng-model)]="user.fullName">
</div>
<div class="input-field">
<label>
Motto
</label>
<input type="text" [(ng-model)]="user.motto">
</div>
<a class="btn-flat wave-effect right" (click)="saveUser()">Save</a>
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

    updateProfilePicture(event: DragEvent) {
        this.prevent(event);
        if (!this.user.isCurrentUser()) {
            return;
        }
        if (!(event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length === 1)) {
            return;
        }
        var file = event.dataTransfer.files[0];
        this.user.profilePicture.write(file);
    }

    updateCoverPicture(event: DragEvent) {
        this.prevent(event);
        if (!this.user.isCurrentUser()) {
            return;
        }
        if (!(event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length === 1)) {
            return;
        }
        var file = event.dataTransfer.files[0];
        this.user.coverPicture.write(file);
    }

    saveUser() {
        if (!this.user.isCurrentUser()) {
            return;
        }
        this.user.patch().then(() => {
            this.user.reload();
        })
    }

    prevent(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }
}
