import { TranslateService } from "@ngx-translate/core";
import { StaticTranslateService } from "../../shared/services/static-translation.service";
import { SnackbarMessageService } from "../../shared/services/snackbar.service";
import { HttpObservationService } from "../../shared/services/http-observation.service";
import { Injectable } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { SnackbarOption } from "../../shared/enums/snackbar-option.enum";
import { SnackbarInput } from "../../shared/enums/snackbar-input.enum";

@Injectable({
    providedIn: 'root'
})
export class SupportHttpInterceptor {

    private delay: any;

    constructor(
        private readonly translate: TranslateService,
        private readonly staticTranslate: StaticTranslateService,
        private readonly snackbarService: SnackbarMessageService,
        private readonly httpObservationService: HttpObservationService
    ) {
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    async handleSupportResponse(httpBody: HttpResponse<any>) {
        await this.delay(1000);

        if(httpBody.url?.includes(`/test/xyz`)) {
            this.httpObservationService.setSupportStatus(true);
            this.snackbarService.notify({
                title: this.translate.currentLang === 'en'
                ? this.staticTranslate.getValidationEN('validation.frontend.support.title', SnackbarInput.TITLE)
                : this.staticTranslate.getValidationDE('validation.frontend.support.title', SnackbarInput.TITLE),
            text: this.translate.currentLang === 'en'
                ? this.staticTranslate.getValidationEN('validation.frontend.support.text', SnackbarInput.TEXT)
                : this.staticTranslate.getValidationDE('validation.frontend.support.text', SnackbarInput.TEXT),
                autoClose: false,
                type: SnackbarOption.success,
            });
        }
    }

    async handleSupportError(response: any) {
        await this.delay(1000);
        
        if(response.url.includes(`/test/xyz`)) {
            this.httpObservationService.setSupportStatus(false);
        }
    }
}