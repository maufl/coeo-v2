import {Component, View, Inject} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, Router} from 'angular2/router';
import {TopNav} from './top-nav';
import {UserView} from './user-view';
import {About} from './about';
import {Login} from './login';


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
    { path: '/', redirectTo: '/login' },
    { path: '/u/:id', component: UserView, as: 'User' },
    { path: '/about', component: About, as: 'About' },
    { path: '/login', component: Login, as: 'Login' }
])
export class CoeoApp {
    router: Router;

    constructor(@Inject(Router) router: Router) {
        this.router = router;
    }
    onInit() {
        this.router.navigate(['/Login']);
    }
}
