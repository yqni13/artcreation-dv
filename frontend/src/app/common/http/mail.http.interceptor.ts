import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { StaticTranslateService } from "../../shared/services/static-translation.service";
import { SnackbarMessageService } from "../../shared/services/snackbar.service";
import { HttpObservationService } from "../../shared/services/http-observation.service";
import { HttpResponse } from "@angular/common/http";
import { SnackbarOption } from "../../shared/enums/snackbar-option.enum";

@Injectable({
    providedIn: 'root'
})
export class MailHttpInterceptor {

    private delay: any;

    constructor(
        private readonly translate: TranslateService,
        private readonly staticTranslate: StaticTranslateService,
        private readonly snackbarService: SnackbarMessageService,
        private readonly httpObservationService: HttpObservationService
    ) {
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    async handleMailResponse(httpBody: HttpResponse<any>) {
        await this.delay(1000);

        if(httpBody.url?.includes('/mailing/send')) {
            this.httpObservationService.setEmailStatus(true);
            this.snackbarService.notify({
                title: this.translate.currentLang === 'en'
                ? this.staticTranslate.getTranslationEN('common.backend.success.email.title')
                : this.staticTranslate.getTranslationDE('common.backend.success.email.title'),
            text: this.translate.currentLang === 'en'
                ? this.staticTranslate.getTranslationEN('common.backend.success.email.text') + httpBody.body.body.response.sender
                : this.staticTranslate.getTranslationDE('common.backend.success.email.text') + httpBody.body.body.response.sender,
                autoClose: true,
                type: SnackbarOption.success,
                displayTime: 10000
            });
        }
    }

    async handleMailError(response: any) {
        await this.delay(1000);
        
        if(response.url.includes('mailing/send')) {
            this.httpObservationService.setEmailStatus(false);
        }
    }
}