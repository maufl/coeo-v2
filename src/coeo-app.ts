import {Component, View} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink} from 'angular2/router';
import {TopNav} from './top-nav';
import {SideBar} from './side-bar';
import {HomeScreen} from './home-screen';
import {UserView} from './user-view';


@Component({ selector: 'coeo-app' })
@View({
   template: `<side-bar></side-bar>
   <top-nav></top-nav>
   <main>
<router-outlet></router-outlet>
</main>
   <footer></footer>`,
    directives: [TopNav, SideBar, RouterOutlet, RouterLink]
})
@RouteConfig([
    { path: '/', component: HomeScreen },
    { path: '/u/:id', component: UserView }
])
export class CoeoApp {

}
