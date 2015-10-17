import {Component, View} from 'angular2/angular2';
import {TopNav} from './top-nav';
import {SideBar} from './side-bar';

@Component({ selector: 'coeo-app' })
@View({
   template: `<side-bar></side-bar>
   <top-nav></top-nav>
   <main></main>
   <footer></footer>`,
   directives: [TopNav, SideBar]
})
export class CoeoApp {

}