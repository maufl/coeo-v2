import {Component, View} from 'angular2/angular2';

@Component({ selector: 'side-bar' })
@View({
template: `<ul class="side-nav">
<li><a href="#!">First Sidebar Link</a></li>
<li><a href="#!">Second Sidebar Link</a></li>
</ul>`

})
export class SideBar {
}