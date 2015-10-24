import {bootstrap, bind} from 'angular2/angular2';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {CoeoApp} from './components/coeo-app';

bootstrap(CoeoApp, [ROUTER_PROVIDERS, bind(LocationStrategy).toClass(HashLocationStrategy)]);
