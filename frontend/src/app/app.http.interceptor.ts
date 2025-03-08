import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { SnackbarMessageService } from './shared/services/snackbar.service';
import { SnackbarOption } from './shared/enums/snackbar-option.enum';
import { HttpObservationService } from './shared/services/http-observation.service';
import { StaticTranslateService } from './shared/services/static-translation.service';
import { TranslateService } from '@ngx-translate/core';
import { GalleryHttpInterceptor } from './common/http/gallery.http.interceptor';
import { MailHttpInterceptor } from './common/http/mail.http.interceptor';


export function appHttpInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const translate = inject(TranslateService);
    const snackbarService = inject(SnackbarMessageService);
    const staticTranslate = inject(StaticTranslateService);
    const httpObservationService = inject(HttpObservationService);
    const galleryIntercept = inject(GalleryHttpInterceptor);
    const mailIntercept = inject(MailHttpInterceptor);
    const apiVersion = '/api/v1';

    return next(req).pipe(
        tap(async (httpEvent) => {
            if((httpEvent as HttpResponse<any>).status === HttpStatusCode.Ok) {
                const httpbody = (httpEvent as HttpResponse<any>);

                if(httpbody.url?.includes(`${apiVersion}/gallery`)) {
                    galleryIntercept.handleGalleryResponse(httpEvent as HttpResponse<any>);
                }
                if(httpbody.url?.includes(`${apiVersion}/mailing`)) {
                    mailIntercept.handleMailResponse(httpEvent as HttpResponse<any>);
                }
            }
        })
        ,
        catchError((response) => {
            handleError(response, httpObservationService, snackbarService, staticTranslate, translate, galleryIntercept, mailIntercept, apiVersion).catch((err) => {
                console.log("Error handling failed", err);
            })
            
            return of(response);
        })
    );
}

export async function handleError(response: any, httpObserve: HttpObservationService, snackbarService: SnackbarMessageService, staticTranslate: StaticTranslateService, translate: TranslateService, galleryIntercept: GalleryHttpInterceptor, mailIntercept: MailHttpInterceptor, apiVersion: string) {
    
    if(response.url.includes(`${apiVersion}/gallery`)) {
        galleryIntercept.handleGalleryError(response);
    }
    if(response.url.includes(`${apiVersion}/mailing`)) {
        mailIntercept.handleMailError(response);
    }

    // user response log
    if(response.statusText === 'Unknown Error' 
        || (response.status === 0 && response.url.includes('/gallery/'))
        || (response.status === 0 && response.url.includes('/mailing/'))) {
        snackbarService.notify({
            title: translate.currentLang === 'en'
                ? staticTranslate.getTranslationEN('common.backend.error.header.InternalServerException')
                : staticTranslate.getTranslationDE('common.backend.error.header.InternalServerException'),
            text: translate.currentLang === 'en'
                ? staticTranslate.getTranslationEN('common.backend.error.data.backend-server')
                : staticTranslate.getTranslationDE('common.backend.error.data.backend-server'),
            autoClose: false,
            type: SnackbarOption.error
        })
    } else if(response.status === 400) {
        Object.entries(response.error.headers.data).forEach((entry: any) => {
            snackbarService.notify({
                title: translate.currentLang === 'en'
                    ? staticTranslate.getTranslationEN('common.backend.error.header.'+response.error.headers.error)
                    : staticTranslate.getTranslationDE('common.backend.error.header.'+response.error.headers.error),
                text: translate.currentLang === 'en'
                    ? staticTranslate.getTranslationEN('common.backend.error.data.' + entry[1].msg)
                    : staticTranslate.getTranslationDE('common.backend.error.data.' + entry[1].msg),
                autoClose: false,
                type: SnackbarOption.error
            })
        })
    } else if(response.status === 535) {
        snackbarService.notify({
            title: translate.currentLang === 'en'
                ? staticTranslate.getTranslationEN('common.backend.error.header.AuthenticationException')
                : staticTranslate.getTranslationDE('common.backend.error.header.AuthenticationException'),
            text: translate.currentLang === 'en'
                ? staticTranslate.getTranslationEN('common.backend.error.data.backend-server')
                : staticTranslate.getTranslationDE('common.backend.error.data.backend-server'),
            autoClose: false,
            type: SnackbarOption.error
        })
    } else if(response.status > 400 || response.status <= 500) {
        snackbarService.notify({
            title: response.error.title,
            text: response.error.text,
            autoClose: true,
            type: SnackbarOption.error,
            displayTime: 10000
        })
    }

    // browser response log
    console.log("response error: ", response);
    httpObserve.setErrorStatus(response);
}