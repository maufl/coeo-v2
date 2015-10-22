import {Component, View, ElementRef} from 'angular2/angular2';
import {RouterLink} from 'angular2/router';

@Component({
    selector: 'side-bar',
    directives: [RouterLink],
    template: `
<a href="#" class="toggle-button" [attr.data-activates]="randomId"></a>
<div id="{{randomId}}" class="side-nav flex-column">
<div class="blue-grey darken-3 white-text center" style="overflow: hidden;"><h3>coeo</h3></div>
<div class="flex"></div>
<div class="center"><a [router-link]="['/About']">about</a></div>
</div>`

})
export class SideBar {
    button: Element;
    randomId: string;
    private initialized: bool;

    constructor(private element:ElementRef) {
        this.button = element.nativeElement.children[0];
        this.randomId = '12341234'; // chosen by random number generator, guaranteed to be random
    }

    show() {
        if (!this.initialized) {
            $(this.button).sideNav();
        }
        $(this.button).sideNav('show');
        this.initialized = true;
    }
}
