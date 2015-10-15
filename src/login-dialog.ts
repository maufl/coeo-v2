import {Component, View, ElementRef} from 'angular2/angular2';

@Component({ selector: 'login-modal' })
@View({
    template: `
<div class="modal">
<div class="modal-content">
<h4>Modal Header</h4>
<p>A bunch of text</p>
</div>
<div class="modal-footer">
<a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
</div>
</div>
`
})
export class LoginModal {
    constructor(private element:ElementRef) {
    }

    open() {
        var top = this.element.nativeElement.children[0];
        $(top).openModal();
    }
}
