import {Component, Input, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';
import {User} from '../models/user';

@Component({
    selector: "cover-photo",
    directives: [FORM_DIRECTIVES, NgIf],
    template: `
<div class="card">
<div (dragover)="prevent($event)" (drop)="updateProfilePicture($event)" class="card-panel z-depth-2" style="z-index: 1; position: absolute; top: 0; right: 0; margin: 20px; height: 100px; width: 100px; background-position: center center; background-size: cover;" [style.background-image]="'url('+user.profilePicture.image.src+')'">
</div>
<div (dragover)="prevent($event)" (drop)="updateCoverPicture($event)" [style.background-image]="'url('+user.coverPicture.image.src+')'" class="card-image" style="background-size: cover; background-position: center center; height: 200px; overflow: hidden;">
<span class="card-title" style="color: black;">{{user.fullName}}</span>
</div>
<div class="card-content">
<i class="material-icons right activator">more_vert</i>
<blockquote style="margin: 0; display: inline;" class="clearfix">{{user.motto}}</blockquote>
</div>
<div class="card-reveal">
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

    saveUser() {
        console.debug(this.user);
        this.user.patch().then(() => {
            this.user.reload();
        })
    }

    prevent(event) {
        event.preventDefault();
        event.stopPropagation();
    }
}
