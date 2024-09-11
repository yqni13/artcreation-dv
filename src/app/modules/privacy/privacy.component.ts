import { DOCUMENT } from "@angular/common";
import { Component, Inject } from "@angular/core";

@Component({
    selector: 'app-privacy',
    templateUrl: './privacy.component.html',
    styleUrl: './privacy.component.scss',
    standalone: true,
    imports: []
})
export class PrivacyComponent {

    constructor(
        @Inject(DOCUMENT) private document: Document
    ) {
        //
    }

    navigateToHeader(id: string) {
        this.document.getElementById(id)?.scrollIntoView();
    }

}