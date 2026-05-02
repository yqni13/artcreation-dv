import { Component } from "@angular/core";
import { ErrorService } from "../../shared/services/error.service";
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

    protected hasData: boolean;
    protected data: any;

    constructor(private readonly errorService: ErrorService) {
        try {
            this.data = Object.keys(content['faq-content']);
            this.hasData = true;
        } catch(err) {
            this.errorService.handle(err);
            this.data = [];
            this.hasData = false;
        }
    }
}