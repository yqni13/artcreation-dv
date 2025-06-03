import { Injectable } from "@angular/core";
import { HttpObservationService } from "../../shared/services/http-observation.service";
import { HttpResponse } from "@angular/common/http";
import { AdminRoute } from "../../api/routes/admin.route.enum";
import { AssetsRoute } from "../../api/routes/assets.route.enum";
import { TranslateService } from "@ngx-translate/core";
import { SnackbarMessageService } from "../../shared/services/snackbar.service";

@Injectable({
    providedIn: 'root'
})
export class AssetsHttpInterceptor {

    constructor(
        private readonly translate: TranslateService,
        private readonly snackbarService: SnackbarMessageService,
        private readonly httpObservationService: HttpObservationService
    ) {
        //
    }

    async handleAssetsResponse(httpBody: HttpResponse<any>) {
        if(httpBody.url?.includes(`${AdminRoute.ASSETS}${AssetsRoute.FINDALL}`)) {
            this.httpObservationService.setAssetsFindAllStatus(true);
            return;
        }     
        if(httpBody.url?.includes(`${AdminRoute.ASSETS}${AssetsRoute.CREATE}`)) {
            this.httpObservationService.setAssetsCreateStatus(true);
            const path = 'validation.frontend.interceptor.assets-create-confirm';
            this.snackbarService.notifyOnInterceptorSuccess(path, this.translate.currentLang, true, 1500);
        } else if(httpBody.url?.includes(`${AdminRoute.ASSETS}${AssetsRoute.UPDATE}`)) {
            this.httpObservationService.setAssetsUpdateStatus(true);
            const path = 'validation.frontend.interceptor.assets-update-confirm';
            this.snackbarService.notifyOnInterceptorSuccess(path, this.translate.currentLang, true, 1500);
        } else if(httpBody.url?.includes(`${AdminRoute.ASSETS}${AssetsRoute.DELETE}`)) {
            this.httpObservationService.setAssetsDeleteStatus(true);
            const path = 'validation.frontend.interceptor.assets-delete-confirm';
            this.snackbarService.notifyOnInterceptorSuccess(path, this.translate.currentLang, true, 1500);
        }
    }

    async handleAssetsError(response: any) {
        if(response.url.includes(`${AdminRoute.ASSETS}${AssetsRoute.FINDONE}`)) {
            this.httpObservationService.setAssetsFindOneStatus(false);
        } else if(response.url.includes(`${AdminRoute.ASSETS}${AssetsRoute.FINDALL}`)) {
            this.httpObservationService.setAssetsFindAllStatus(false);
        } else if(response.url.includes(`${AdminRoute.ASSETS}${AssetsRoute.CREATE}`)) {
            this.httpObservationService.setAssetsCreateStatus(false);
        } else if(response.url.includes(`${AdminRoute.ASSETS}${AssetsRoute.UPDATE}`)) {
            this.httpObservationService.setAssetsUpdateStatus(false);
        } else if(response.url.includes(`${AdminRoute.ASSETS}${AssetsRoute.DELETE}`)) {
            this.httpObservationService.setAssetsDeleteStatus(false);
        }
    }
}