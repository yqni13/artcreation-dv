/* eslint-disable @typescript-eslint/no-explicit-any */
import { TranslateService } from "@ngx-translate/core";
import { StaticTranslateService } from "../../shared/services/static-translation.service";
import { SnackbarMessageService } from "../../shared/services/snackbar.service";
import { HttpObservationService } from "../../shared/services/http-observation.service";
import { inject, Injectable } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { SnackbarOption } from "../../shared/enums/snackbar-option.enum";
import { SnackbarInput } from "../../shared/enums/snackbar-input.enum";

@Injectable({
    providedIn: 'root'
})
export class SupportHttpInterceptor {

    private readonly translate = inject(TranslateService);
    private readonly staticTranslate = inject(StaticTranslateService);
    private readonly snackbarService = inject(SnackbarMessageService);
    private readonly httpObservationService = inject(HttpObservationService);

    async handleSupportResponse(httpBody: HttpResponse<any>) {
        if(httpBody.url?.includes(`/feedback-rating/name`)) {
            this.httpObservationService.setRatingStatus(true);
        } else if (httpBody.url?.includes(`/feedback/create`)) {
            this.httpObservationService.setFeedbackStatus(true);
            const path = 'validation.frontend.interceptor.support-feedback-confirm';
            this.snackbarService.notifyOnInterceptorSuccess(path, this.translate.currentLang, true, 1500);
        } else if(httpBody.url?.includes(`/tickets/create`)) {
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
        if(response.url.includes(`/feedback-rating/name`)) {
            this.httpObservationService.setRatingStatus(false);
        } else if(response.url.includes(`/feedback/create`)) {
            this.httpObservationService.setFeedbackStatus(false);
        } else if(response.url.includes(`/tickets/create`)) {
            this.httpObservationService.setSupportStatus(false);
        }
    }
}