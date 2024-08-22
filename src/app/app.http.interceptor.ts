/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpEvent, HttpHandlerFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { SnackbarMessageService } from './shared/services/snackbar.service';
import { SnackbarOption } from './shared/enums/snackbar-option.enum';


export function appHttpInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const snackbarService = inject(SnackbarMessageService);
    return next(req).pipe(
        catchError((response) => {
            if(response.status === 500) {
                console.log("we caught error 500");
                snackbarService.notify({
                    title: 'Message failed to send.',
                    text: 'Please check your email address or try again later.',
                    autoClose: true,
                    type: SnackbarOption.error,
                    displayTime: 5000
                });
            }

            // TODO(yqni13): not working
            if(response.status === HttpStatusCode.NoContent) {
                console.log("we caught success 204");
            }
            if(response.status === HttpStatusCode.Ok) {
                console.log("we caught success 200");
            }

            return of(response);
        })
    );
}
