import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { SnackbarMessageService } from './shared/services/snackbar.service';
import { HttpObservationService } from './shared/services/http-observation.service';
import { TranslateService } from '@ngx-translate/core';
import { GalleryHttpInterceptor } from './common/http/gallery.http.interceptor';
import { MailHttpInterceptor } from './common/http/mail.http.interceptor';
import { AdminRoute } from './api/routes/admin.route.enum';
import { AuthHttpInterceptor } from './common/http/auth.http.interceptor';


export function appHttpInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const translate = inject(TranslateService);
    const snackbarService = inject(SnackbarMessageService);
    const httpObservationService = inject(HttpObservationService);
    const authIntercept = inject(AuthHttpInterceptor);
    const galleryIntercept = inject(GalleryHttpInterceptor);
    const mailIntercept = inject(MailHttpInterceptor);

    return next(req).pipe(
        tap(async (httpEvent) => {
            if((httpEvent as HttpResponse<any>).status === HttpStatusCode.Ok) {
                const httpbody = (httpEvent as HttpResponse<any>);

                if(httpbody.url?.includes(AdminRoute.AUTH)) {
                    authIntercept.handleAuthResponse(httpEvent as HttpResponse<any>);
                }
                if(httpbody.url?.includes(AdminRoute.GALLERY)) {
                    galleryIntercept.handleGalleryResponse(httpEvent as HttpResponse<any>);
                }
                if(httpbody.url?.includes(AdminRoute.MAILING)) {
                    mailIntercept.handleMailResponse(httpEvent as HttpResponse<any>);
                }
            }
        })
        ,
        catchError((response) => {
            handleError(response, httpObservationService, snackbarService, translate, authIntercept, galleryIntercept, mailIntercept).catch((err) => {
                console.log("Error handling failed", err);
            })
            
            return of(response);
        })
    );
}

export async function handleError(response: any, httpObserve: HttpObservationService, snackbarService: SnackbarMessageService, translate: TranslateService, authIntercept: AuthHttpInterceptor, galleryIntercept: GalleryHttpInterceptor, mailIntercept: MailHttpInterceptor) {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    if(response.url.includes(AdminRoute.AUTH)) {
        authIntercept.handleAuthError(response);
    }
    if(response.url.includes(AdminRoute.GALLERY)) {
        galleryIntercept.handleGalleryError(response);
    }
    if(response.url.includes(AdminRoute.MAILING)) {
        mailIntercept.handleMailError(response);
    }

    await delay(1500); // delay after response animation starts
    
    // user response log
    if(response.status === 0 &&
        (response.url.includes(AdminRoute.AUTH)
        || response.url.includes(AdminRoute.GALLERY)
        || response.url.includes(AdminRoute.MAILING)
        || response.url.includes(AdminRoute.NEWS))) {
        Object.assign(response, {
            error: {
                headers: {
                    error: 'InternalServerException',
                    message: 'server-500-routes'
                }
            }
        })
        const message = String(response.error.headers.message);
        snackbarService.notifyOnInterceptorError(response, translate.currentLang, message, false);
    }
    // SERVER CONNECTION
    else if(response.status === 500) {
        Object.assign(response, {
            error: {
                headers: {
                    error: 'InternalServerException',
                    message: 'server-500-connection'
                }
            }
        })
        const message = String(response.error.headers.message);
        snackbarService.notifyOnInterceptorError(response, translate.currentLang, message, false);
    }
    // PROPERTY VALIDATION
    else if(response.status === 400) {
        Object.entries(response.error.headers.data).forEach((entry: any) => {
            const message = String(entry[1].msg);
            snackbarService.notifyOnInterceptorError(response, translate.currentLang, message, false);
        })
    } 
    // AUTHENTICATION VALIDATION
    else if(response.status === 535) {
        const message = response.error.headers.message ? response.error.headers.message : 'server-535-auth#server';
        snackbarService.notifyOnInterceptorError(response, translate.currentLang, message, false);
    } 
    else if(response.status === 502 || response.status === 504) {
        const message = response.error.headers.message ? response.error.headers.message : 'error-unknown';
        snackbarService.notifyOnInterceptorError(response, translate.currentLang, message, false);
    }
    // OTHER VALIDATION
    else if(response.status > 400 || response.status < 500 || response.status === 535) {
        const message = response.error.headers.message ? response.error.headers.message : 'error-unknown';
        snackbarService.notifyOnInterceptorError(response, translate.currentLang, message, false);
    }

    // browser response log
    console.log("response error: ", response);
    httpObserve.setErrorStatus(response);
}
