import { CommonModule, DOCUMENT } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'app-privacy',
    templateUrl: './privacy.component.html',
    styleUrl: './privacy.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class PrivacyComponent {

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private translate: TranslateService
    ) {
        //
    }

    navigateToHeader(id: string) {
        this.document.getElementById(id)?.scrollIntoView();
    }

}