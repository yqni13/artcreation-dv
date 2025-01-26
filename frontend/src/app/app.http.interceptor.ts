/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { SnackbarMessageService } from './shared/services/snackbar.service';
import { SnackbarOption } from './shared/enums/snackbar-option.enum';
import { HttpObservationService } from './shared/services/http-observation.service';
import { StaticTranslateService } from './shared/services/static-translation.service';
import { TranslateService } from '@ngx-translate/core';


export function appHttpInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const translate = inject(TranslateService);
    const snackbarService = inject(SnackbarMessageService);
    const staticTranslate = inject(StaticTranslateService);
    const httpObservationService = inject(HttpObservationService);
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    return next(req).pipe(
        tap(async (httpEvent) => {
            if((httpEvent as HttpResponse<any>).status === HttpStatusCode.Ok) {
                const httpbody = (httpEvent as HttpResponse<any>);
                if(httpbody.url?.includes('/mailing/send')) {
                    await delay(1000);
                    httpObservationService.setEmailStatus(true);
                    snackbarService.notify({
                        title: translate.currentLang === 'en'
                        ? staticTranslate.getTranslationEN('common.backend.success.email.title')
                        : staticTranslate.getTranslationDE('common.backend.success.email.title'),
                    text: translate.currentLang === 'en'
                        ? staticTranslate.getTranslationEN('common.backend.success.email.text') + (httpEvent as HttpResponse<any>).body.body.response.sender
                        : staticTranslate.getTranslationDE('common.backend.success.email.text') + (httpEvent as HttpResponse<any>).body.body.response.sender,
                        autoClose: true,
                        type: SnackbarOption.success,
                        displayTime: 10000
                    });
                }
            }
        })
        ,
        catchError((response) => {
            handleError(response, httpObservationService, snackbarService, staticTranslate, translate).catch((err) => {
                console.log("Error handling failed", err);
            })
            
            return of(response);
        })
    );
}

export async function handleError(response: any, httpObserve: HttpObservationService, snackbarService: SnackbarMessageService, staticTranslate: StaticTranslateService, translate: TranslateService) {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    console.log("response error: ", response);

    if(response.url.includes('/mailing/send')) {
        await delay(1000);
        httpObserve.setEmailStatus(false);
    }


    if(response.statusText === 'Unknown Error' || (response.status === 0 && response.url.includes('/mailing/'))) {
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
}