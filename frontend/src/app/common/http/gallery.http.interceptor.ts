import { AdminRoute } from '../../api/routes/admin.route.enum';
import { HttpResponse } from "@angular/common/http";
import { SnackbarMessageService } from "../../shared/services/snackbar.service";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { GalleryRoute } from "../../api/routes/gallery.route.enum";
import { HttpObservationService } from "../../shared/services/http-observation.service";

@Injectable({
    providedIn: 'root'
})
export class GalleryHttpInterceptor {

    private delay: any;

    constructor(
        private readonly translate: TranslateService,
        private readonly snackbarService: SnackbarMessageService,
        private readonly httpObservationService: HttpObservationService
    ) {
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    async handleGalleryResponse(httpBody: HttpResponse<any>) {
        if(httpBody.url?.includes(`${AdminRoute.GALLERY}${GalleryRoute.FINDALL}`)) {
            this.httpObservationService.setGalleryFindAllStatus(true);
            return;
        } 
        
        await this.delay(1000);
    
        if(httpBody.url?.includes(`${AdminRoute.GALLERY}${GalleryRoute.CREATE}`)) {
            this.httpObservationService.setGalleryCreateStatus(true);
            const path = 'validation.frontend.interceptor.gallery-create-confirm';
            this.snackbarService.notifyOnInterceptorSuccess(path, this.translate.currentLang, true, 1500);
        } else if(httpBody.url?.includes(`${AdminRoute.GALLERY}${GalleryRoute.UPDATE}`)) {
            this.httpObservationService.setGalleryUpdateStatus(true);
            const path = 'validation.frontend.interceptor.gallery-update-confirm';
            this.snackbarService.notifyOnInterceptorSuccess(path, this.translate.currentLang, true, 1500);
        } else if(httpBody.url?.includes(`${AdminRoute.GALLERY}${GalleryRoute.DELETE}`)) {
            this.httpObservationService.setGalleryDeleteStatus(true);
            const path = 'validation.frontend.interceptor.gallery-delete-confirm';
            this.snackbarService.notifyOnInterceptorSuccess(path, this.translate.currentLang, true, 1500);
        }
    }

    async handleGalleryError(response: any) {
        if(response.url.includes(`${AdminRoute.GALLERY}${GalleryRoute.FINDONE}`)) {
            this.httpObservationService.setGalleryFindOneStatus(false);
        } else if(response.url.includes(`${AdminRoute.GALLERY}${GalleryRoute.FINDALL}`)) {
            this.httpObservationService.setGalleryFindAllStatus(false);
        } else if(response.url.includes(`${AdminRoute.GALLERY}${GalleryRoute.CREATE}`)) {
            this.httpObservationService.setGalleryCreateStatus(false);
        } else if(response.url.includes(`${AdminRoute.GALLERY}${GalleryRoute.UPDATE}`)) {
            this.httpObservationService.setGalleryUpdateStatus(false);
        } else if(response.url.includes(`${AdminRoute.GALLERY}${GalleryRoute.DELETE}`)) {
            this.httpObservationService.setGalleryDeleteStatus(false);
        }
    }
}
