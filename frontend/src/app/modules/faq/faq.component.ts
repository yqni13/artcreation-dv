import { Component } from "@angular/core";
import { default as faqData } from "../../shared/data/faq-data.json";
import { ErrorService } from "../../shared/services/error.service";
import { CommonModule } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { FAQItems } from "../../shared/interfaces/FAQItems";

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrl: './faq.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class FAQComponent {

    protected data: FAQItems[];
    protected hasData: boolean;

    constructor(
        private errorService: ErrorService,
        private translate: TranslateService
    ) {
        try {
            this.data = faqData;
            this.hasData = true;
        } catch(err) {
            this.errorService.handle(err);
            this.data = [];
            this.hasData = false;
        }
    }

    // TODO(yqni13): need custom sorting of object keys for FAQ?
}