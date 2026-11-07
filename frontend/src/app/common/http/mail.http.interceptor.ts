/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { StaticTranslateService } from "../../shared/services/static-translation.service";
import { SnackbarMessageService } from "../../shared/services/snackbar.service";
import { HttpObservationService } from "../../shared/services/http-observation.service";
import { HttpResponse } from "@angular/common/http";
import { SnackbarOption } from "../../shared/enums/snackbar-option.enum";
import { AdminRoute } from "../../api/routes/admin.route.enum";
import { MailRoute } from "../../api/routes/mail.route.enum";
import { SnackbarInput } from "../../shared/enums/snackbar-input.enum";

@Injectable({
    providedIn: 'root'
})
export class MailHttpInterceptor {

    private readonly translate = inject(TranslateService);
    private readonly staticTranslate = inject(StaticTranslateService);
    private readonly snackbarService = inject(SnackbarMessageService);
    private readonly httpObservationService = inject(HttpObservationService);

    private delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    async handleMailResponse(httpBody: HttpResponse<any>) {
        await this.delay(1000);

        if(httpBody.url?.includes(`${AdminRoute.MAILING}${MailRoute.SEND}`)) {
            this.httpObservationService.setEmailStatus(true);
            this.snackbarService.notify({
                title: this.translate.currentLang === 'en'
                ? this.staticTranslate.getValidationEN('validation.frontend.email.title', SnackbarInput.TITLE)
                : this.staticTranslate.getValidationDE('validation.frontend.email.title', SnackbarInput.TITLE),
            text: this.translate.currentLang === 'en'
                ? this.staticTranslate.getValidationEN('validation.frontend.email.text', SnackbarInput.TEXT)
                : this.staticTranslate.getValidationDE('validation.frontend.email.text', SnackbarInput.TEXT),
                autoClose: false,
                type: SnackbarOption.success,
            });
        }
    }

    async handleMailError(response: any) {
        await this.delay(1000);
        
        if(response.url.includes(`${AdminRoute.MAILING}${MailRoute.SEND}`)) {
            this.httpObservationService.setEmailStatus(false);
        }
    }
}