import {Component, Input, NgIf} from 'angular2/angular2';
import {fosp} from './services/fosp';

@Component({
    selector: "cover-photo",
    directives: [NgIf],
    template: `
<div class="card">
<div *ng-if="profile" class="card-panel z-depth-2" style="z-index: 1; position: absolute; top: 0; right: 0; margin: 20px; height: 100px; width: 100px; background-position: center center; background-size: cover;" [style.background-image]="'url('+profile.src+')'">
</div>
<div class="card-image" style="height: 200px; overflow: hidden;">
<img *ng-if="cover" [src]="cover.src">
<span class="card-title" style="color: black;">{{username}}</span>
</div>
<div class="card-content" *ng-if="motto">
<blockquote style="margin: 0;">{{motto}}</blockquote>
</div>
</div>
`
})
export class CoverPhoto {
    @Input() userid: string;
    @Input() username: string;
    image: Image;
    motto: string;

    onInit() {
        fosp.loadImage(this.userid + '/soc/photos/cover').then((image) => {
            this.cover = image;
        }).catch((error) => {
            console.log("Could not load cover photo ", error);
        });
        fosp.loadImage(this.userid + '/soc/photos/profile').then((image) => {
            this.profile = image;
        }).catch((error) => {
            console.log("Could not load cover photo ", error);
        });
        fosp.get(this.userid + '/soc/me/motto').then((motto) => {
            this.motto = motto;
        })
        return true;
    }
}
