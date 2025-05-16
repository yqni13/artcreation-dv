import { HttpObservationService } from './../../shared/services/http-observation.service';
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SnackbarMessageService } from "../../shared/services/snackbar.service";
import { HttpResponse } from '@angular/common/http';
import { AdminRoute } from '../../api/routes/admin.route.enum';
import { NewsRoute } from '../../api/routes/news.route.enum';

@Injectable({
    providedIn: 'root'
})
export class NewsHttpInterceptor {

    constructor(
        private readonly translate: TranslateService,
        private readonly snackbarService: SnackbarMessageService,
        private readonly httpObservationService: HttpObservationService
    ) {
        //
    }

    async handleNewsResponse(httpBody: HttpResponse<any>) {
        if(httpBody.url?.includes(`${AdminRoute.NEWS}/${NewsRoute.FINDONEWGP}`)) {
            this.httpObservationService.setNewsFindOneWithGalleryPathsStatus(true);
            return;
        }        
        if(httpBody.url?.includes(`${AdminRoute.NEWS}/${NewsRoute.FINDALLWGP}`)) {
            this.httpObservationService.setNewsFindAllWithGalleryPathsStatus(true);
            return;
        }        
        if(httpBody.url?.includes(`${AdminRoute.NEWS}/${NewsRoute.CREATE}`)) {
            this.httpObservationService.setNewsCreateStatus(true);
            const path = 'validation.frontend.interceptor.news-create-confirm';
            this.snackbarService.notifyOnInterceptorSuccess(path, this.translate.currentLang, true, 1500);
        } else if(httpBody.url?.includes(`${AdminRoute.NEWS}/${NewsRoute.UPDATE}`)) {
            this.httpObservationService.setNewsUpdateStatus(true);
            const path = 'validation.frontend.interceptor.news-update-confirm';
            this.snackbarService.notifyOnInterceptorSuccess(path, this.translate.currentLang, true, 1500);
        } else if(httpBody.url?.includes(`${AdminRoute.NEWS}/${NewsRoute.DELETE}`)) {
            this.httpObservationService.setNewsDeleteStatus(true);
            const path = 'validation.frontend.interceptor.news-delete-confirm';
            this.snackbarService.notifyOnInterceptorSuccess(path, this.translate.currentLang, true, 1500);
        }

        // DEPRECATED
        if(httpBody.url?.includes(`${AdminRoute.NEWS}/${NewsRoute.FINDONE_Deprecated}`)) {
            this.httpObservationService.setNewsFindOneStatus(true);
            return;
        }
        if(httpBody.url?.includes(`${AdminRoute.NEWS}/${NewsRoute.FINDALL_Deprecated}`)) {
            this.httpObservationService.setNewsFindAllStatus(true);
            return;
        }
    }

    async handleNewsError(response: any) {
        if(response.url.includes(`${AdminRoute.NEWS}/${NewsRoute.FINDONEWGP}`)) {
            this.httpObservationService.setNewsFindOneWithGalleryPathsStatus(false);
        } else if(response.url.includes(`${AdminRoute.NEWS}/${NewsRoute.FINDALLWGP}`)) {
            this.httpObservationService.setNewsFindAllWithGalleryPathsStatus(false);
        } else if(response.url.includes(`${AdminRoute.NEWS}/${NewsRoute.CREATE}`)) {
            this.httpObservationService.setNewsCreateStatus(false);
        } else if(response.url.includes(`${AdminRoute.NEWS}/${NewsRoute.UPDATE}`)) {
            this.httpObservationService.setNewsUpdateStatus(false);
        } else if(response.url.includes(`${AdminRoute.NEWS}/${NewsRoute.DELETE}`)) {
            this.httpObservationService.setNewsDeleteStatus(false);
        } else if(response.url.includes(`${AdminRoute.NEWS}/${NewsRoute.FINDONE_Deprecated}`)) {
            this.httpObservationService.setNewsFindOneStatus(false);
        } else if(response.url.includes(`${AdminRoute.NEWS}/${NewsRoute.FINDALL_Deprecated}`)) {
            this.httpObservationService.setNewsFindAllStatus(false);
        }
    }
}