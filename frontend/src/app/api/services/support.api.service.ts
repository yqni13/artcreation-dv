import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { SupportXYZRequest } from "../interfaces/support.interface";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SupportAPIService {

    private xyzData: SupportXYZRequest;
    private domainPathV1: string;
    private urlXYZ: string;

    constructor(private readonly http: HttpClient) {
        this.xyzData = { test: '' };
        this.domainPathV1 = '/api/v1/test';
        this.urlXYZ = `${environment.API_SUPPORT_URL}${this.domainPathV1}/xyz`;
    }

    setXYZData(data: SupportXYZRequest) {
        this.xyzData = data;
    }

    sendXYZRequest(): Observable<HttpResponse<any>> {
        return this.http.post<any>(this.urlXYZ, this.xyzData, { 
            headers: {
                'API-Key': 'I_want_to_be_an_env-var_when_I_grow_up'
            },
            observe: 'response'
        }).pipe(
            catchError(err => throwError(() => err))
        );
    }
}