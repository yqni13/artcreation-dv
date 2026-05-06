import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import * as content from "../../../../public/assets/i18n/privacy-en.json";

@Component({
    selector: 'app-privacy',
    imports: [
        TranslateModule
    ],
    templateUrl: './privacy.component.html',
    styleUrl: './privacy.component.scss'
})
export class PrivacyComponent {

    protected privacyData: string[] = this.configContentLoop();

    private configContentLoop() {
        const usedNumberOfElements = Object.keys(content['privacy-content']['headers']);
        return usedNumberOfElements.filter(item => item !== 'complaint');
    }

    navigateToHeader(id: string) {
        document.getElementById(id)?.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
}