import { Injectable } from "@angular/core";
import { HttpObservationService } from "../../shared/services/http-observation.service";
import { HttpResponse } from "@angular/common/http";
import { AdminRoute } from "../../api/routes/admin.route.enum";
import { AuthRoute } from "../../api/routes/auth.route.enum";

@Injectable({
    providedIn: 'root'
})
export class AuthHttpInterceptor {

    private delay: any;

    constructor(private readonly httpObservation: HttpObservationService) {
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    async handleAuthResponse(httpBody: HttpResponse<any>) {
        await this.delay(500);

        if(httpBody.url?.includes(`${AdminRoute.AUTH}${AuthRoute.LOGIN}`)) {
            this.httpObservation.setLoginStatus(true);
        }
    }

    async handleAuthError(response: any) {
        if(response.url.includes(`${AdminRoute.AUTH}${AuthRoute.LOGIN}`)) {
            this.httpObservation.setLoginStatus(false);
        }
    }
}