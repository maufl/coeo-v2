import {Component, View, ElementRef, NgIf, NgFor} from 'angular2/angular2';
import {RouterLink} from 'angular2/router';
import {fosp} from '../services/fosp';
import {User} from '../models/user';

@Component({
    selector: 'side-bar',
    directives: [NgIf, NgFor, RouterLink],
    template: `
<a href="#" class="toggle-button" [attr.data-activates]="randomId"></a>
<div id="{{randomId}}" class="side-nav flex-column">
<div class="blue-grey darken-3 white-text center" style="overflow: hidden;"><h3>coeo</h3></div>
<div class="flex">
<div *ng-if="user" style="padding-top: 10px;">
<div *ng-for="#group of user.groups">
<span class="grey-text darken-4" style="font-size: 1.3em; line-height: 1.5em; display: block; padding: 0 10px;">{{group.name}}</span>
<ul>
<li class="black-text" style="line-height: 1.5em;" *ng-for="#user of group.members" [router-link]="['/User', {id: user.id}]">
{{user.fullName || user.id}}
</li>
</ul>
</div>
</div>
</div>
<div class="center"><a [router-link]="['/About']">about</a></div>
</div>`

})
export class SideBar {
    button: Element;
    randomId: string;
    private initialized: boolean;
    user: User = null;

    constructor(private element:ElementRef) {
        this.button = element.nativeElement.children[0];
        this.randomId = '12341234'; // chosen by random number generator, guaranteed to be random
        fosp.on('authenticated', () => {
            this.user = fosp.currentUser;
            this.user.load().then(() => {
                this.user.groups.forEach(group => { group.load().then(() => { group.members.forEach(user => { user.load() });  }) });
            });
        })
    }

    show() {
        if (!this.initialized) {
            $(this.button).sideNav();
        }
        $(this.button).sideNav('show');
        this.initialized = true;
    }
}
