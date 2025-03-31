import { CommonModule, DOCUMENT } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import * as content from "../../../../public/assets/i18n/privacy-en.json";

@Component({
    selector: 'app-privacy',
    templateUrl: './privacy.component.html',
    styleUrl: './privacy.component.scss',
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class PrivacyComponent {

    protected privacyData: string[];

    constructor(
        @Inject(DOCUMENT) private document: Document
    ) {
        this.privacyData = this.configContentLoop();
    }

    private configContentLoop() {
        const usedNumberOfElements = Object.keys(content['privacy-content']['headers']);
        return usedNumberOfElements.filter(item => item !== 'complaint');
    }

    navigateToHeader(id: string) {
        this.document.getElementById(id)?.scrollIntoView({behavior: 'smooth', block: 'start'});
    }

}