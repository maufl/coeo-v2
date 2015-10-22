import {Component} from 'angular2/angular2';

@Component({
    selector: `about`,
    template: `
<div class="container center">
<h3>About</h3>
<p>
This the Coeo web application, an online social network, build on top of <a href="https://github.com/maufl/fosp-specification" target="blank">FOSP</a>.
It is developed by <a href="http://felixmaurer.de/" target="blank">Felix Maurer</a>.
</p>
<p>
Coeo uses <a href="http://angular.io/" target="blank">Angular2</a> and the <a href="http://materializecss.com/" target="blank">Materialize</a> framework.
</p>
<p>
Copyright 2015 Felix Maurer
</P>
</div>
`
})
export class About {
}
