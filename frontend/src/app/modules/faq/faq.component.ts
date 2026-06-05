import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import * as content from "../../../../public/assets/i18n/faq-content-en.json";

@Component({
    selector: 'app-faq',
    imports: [
        TranslateModule
    ],
    templateUrl: './faq.component.html',
    styleUrl: './faq.component.scss'
})
export class FAQComponent {

    protected data: string[] = Object.keys(content['faq-content']);
    protected hasData = true;
}