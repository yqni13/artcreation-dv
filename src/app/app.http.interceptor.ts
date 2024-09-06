/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { SnackbarMessageService } from './shared/services/snackbar.service';
import { SnackbarOption } from './shared/enums/snackbar-option.enum';


export function appHttpInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const snackbarService = inject(SnackbarMessageService);
    return next(req).pipe(
        tap((httpEvent) => {
            if((httpEvent as HttpResponse<any>).status === HttpStatusCode.Ok) {
                snackbarService.notify({
                    title: (httpEvent as HttpResponse<any>).body.title,
                    text: (httpEvent as HttpResponse<any>).body.text,
                    autoClose: true,
                    type: SnackbarOption.success,
                    displayTime: 10000
                });
            }
        })
        ,
        catchError((response) => {
            console.log("response: ", response);
            if(response.status === 500 || response.status === 535) {
                snackbarService.notify({
                    title: response.error.title,
                    text: response.error.text,
                    autoClose: true,
                    type: SnackbarOption.error,
                    displayTime: 10000
                })
            } else if(response.statusText === 'Unknown Error') {
                snackbarService.notify({
                    title: 'Email not sent',
                    text: 'Service not reachable. Please try again later.',
                    autoClose: true,
                    type: SnackbarOption.error,
                    displayTime: 10000
                })
            }
            return of(response);
        })
    );
}
