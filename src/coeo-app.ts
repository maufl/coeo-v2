import {Component, View} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink} from 'angular2/router';
import {TopNav} from './top-nav';
import {HomeScreen} from './home-screen';
import {UserView} from './user-view';
import {About} from './about';


@Component({ selector: 'coeo-app' })
@View({
   template: `<top-nav></top-nav>
   <main>
<router-outlet></router-outlet>
</main>
   <footer></footer>`,
    directives: [TopNav, RouterOutlet, RouterLink]
})
@RouteConfig([
    { path: '/', component: HomeScreen, as: 'Home' },
    { path: '/u/:id', component: UserView, as: 'User' },
    { path: '/about', component: About, as: 'About'}
])
export class CoeoApp {

}
