import { HttpResponse } from "@angular/common/http";
import { SnackbarMessageService } from "../../shared/services/snackbar.service";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { StaticTranslateService } from "../../shared/services/static-translation.service";
import { GalleryRoute } from "../../api/routes/gallery.route.enum";
import { SnackbarOption } from "../../shared/enums/snackbar-option.enum";
import { HttpObservationService } from "../../shared/services/http-observation.service";

@Injectable({
    providedIn: 'root'
})
export class GalleryHttpInterceptor {

    private delay: any;

    constructor(
        private readonly translate: TranslateService,
        private readonly staticTranslate: StaticTranslateService,
        private readonly snackbarService: SnackbarMessageService,
        private readonly httpObservationService: HttpObservationService
    ) {
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    async handleGalleryResponse(httpBody: HttpResponse<any>) {
        await this.delay(1000);
    
        if(httpBody.url?.includes(`gallery${GalleryRoute.findOne}`)) {
            
        } else if(httpBody.url?.includes(`gallery${GalleryRoute.findAll}`)) {
            //
        } else if(httpBody.url?.includes(`gallery${GalleryRoute.create}`)) {
            this.httpObservationService.setGalleryCreateStatus(true);
            this.snackbarService.notify({
                title: this.translate.currentLang === 'en'
                    ? this.staticTranslate.getValidationEN('validation.frontend.interceptor.gallery-create-confirm')
                    : this.staticTranslate.getValidationDE('validation.frontend.interceptor.gallery-create-confirm'),
                text: '',
                autoClose: true,
                type: SnackbarOption.success,
                displayTime: 3500
            })
        } else if(httpBody.url?.includes(`gallery${GalleryRoute.update}`)) {
            this.httpObservationService.setGalleryUpdateStatus(true);
            this.snackbarService.notify({
                title: this.translate.currentLang === 'en'
                    ? this.staticTranslate.getValidationEN('validation.frontend.interceptor.gallery-update-confirm')
                    : this.staticTranslate.getValidationDE('validation.frontend.interceptor.gallery-update-confirm'),
                text: '',
                autoClose: true,
                type: SnackbarOption.info,
                displayTime: 3500
            })
        } else if(httpBody.url?.includes(`gallery${GalleryRoute.delete}`)) {
            this.httpObservationService.setGalleryDeleteStatus(true);
            this.snackbarService.notify({
                title: this.translate.currentLang === 'en'
                    ? this.staticTranslate.getValidationEN('validation.frontend.interceptor.gallery-delete-confirm')
                    : this.staticTranslate.getValidationDE('validation.frontend.interceptor.gallery-delete-confirm'),
                text: '',
                autoClose: true,
                type: SnackbarOption.success,
                displayTime: 3500
            })
        }
    }

    async handleGalleryError(response: any) {
        await this.delay(1000);
        if(response.url.includes(`gallery${GalleryRoute.findOne}`)) {
            this.httpObservationService.setGalleryFindOneStatus(false);
        } else if(response.url.includes(`gallery${GalleryRoute.findAll}`)) {
            this.httpObservationService.setGalleryFindAllStatus(false);
        } else if(response.url.includes(`gallery${GalleryRoute.create}`)) {
            this.httpObservationService.setGalleryCreateStatus(false);
        } else if(response.url.includes(`gallery${GalleryRoute.update}`)) {
            this.httpObservationService.setGalleryUpdateStatus(false);
        } else if(response.url.includes(`gallery${GalleryRoute.delete}`)) {
            this.httpObservationService.setGalleryDeleteStatus(false);
        }
    }
}
