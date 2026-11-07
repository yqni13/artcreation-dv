/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { AdminRoute } from "../routes/admin.route.enum";
import { AssetsRoute } from "../routes/assets.route.enum";
import { AssetsCreateRequest, AssetsUpdateRequest } from "../interfaces/assets-request.interface";
import { Observable } from "rxjs";
import { AssetsCreateUpdateResponse, AssetsDeleteResponse, AssetsItemResponse, AssetsListResponse } from "../interfaces/assets.response.interface";

@Injectable({
    providedIn: 'root'
})
export class AssetsAPIService {

    private readonly http = inject(HttpClient);

    private idParam = '';
    private formDataCreate = new FormData();
    private formDataUpdate = new FormData();

    private domainPathV1 = '/api/v1';
    private urlGetOne = `${environment.API_BASE_URL}${this.domainPathV1}${AdminRoute.ASSETS}${AssetsRoute.FINDONE}`;
    private urlGetAll = `${environment.API_BASE_URL}${this.domainPathV1}${AdminRoute.ASSETS}${AssetsRoute.FINDALL}`;
    private urlCreate = `${environment.API_BASE_URL}${this.domainPathV1}${AdminRoute.ASSETS}${AssetsRoute.CREATE}`;
    private urlUpdate = `${environment.API_BASE_URL}${this.domainPathV1}${AdminRoute.ASSETS}${AssetsRoute.UPDATE}`;
    private urlDelete = `${environment.API_BASE_URL}${this.domainPathV1}${AdminRoute.ASSETS}${AssetsRoute.DELETE}`;

    setIdParam(id: string) {
        this.idParam = id;
    }

    setCreatePayload(data: any) {
        const imageFile = data.imageFile;
        const payloadCreate: AssetsCreateRequest = {
            category: data.category,
            imagePath: data.imagePath === '' ? null : data.imagePath,
            thumbnailPath: data.thumbnailPath === '' ? null : data.thumbnailPath,
            location: data.location,
            datetime: data.datetime
        };
        this.formDataCreate = new FormData();
        this.formDataCreate.append('file', imageFile);
        this.formDataCreate.append('data', JSON.stringify(payloadCreate));
    }

    setUpdatePayload(data: any) {
        const payloadUpdate: AssetsUpdateRequest = {
            id: data.id,
            category: data.category,
            imagePath: data.imagePath === '' ? null : data.imagePath,
            thumbnailPath: data.thumbnailPath === '' ? null : data.thumbnailPath,
            location: data.location,
            datetime: data.datetime
        };
        this.formDataUpdate = new FormData();
        if(data.imageFile) {
            const imageFile = data.imageFile;
            this.formDataUpdate.append('file', imageFile);
        }
        this.formDataUpdate.append('data', JSON.stringify(payloadUpdate));
    }

    sendGetOneRequest(): Observable<HttpResponse<AssetsItemResponse>> {
        return this.http.get<AssetsItemResponse>(`${this.urlGetOne}/${this.idParam}`, { observe: 'response'});
    }

    sendGetAllRequest(): Observable<HttpResponse<AssetsListResponse>> {
        return this.http.get<AssetsListResponse>(this.urlGetAll, { observe: 'response' });
    }

    sendCreateRequest(): Observable<HttpResponse<AssetsCreateUpdateResponse>> {
        return this.http.post<AssetsCreateUpdateResponse>(this.urlCreate, this.formDataCreate, { observe: 'response'});
    }

    sendUpdateRequest(): Observable<HttpResponse<AssetsCreateUpdateResponse>> {
        return this.http.put<AssetsCreateUpdateResponse>(this.urlUpdate, this.formDataUpdate, { observe: 'response'});
    }

    sendDeleteRequest(): Observable<HttpResponse<AssetsDeleteResponse>> {
        return this.http.delete<AssetsDeleteResponse>(`${this.urlDelete}/${this.idParam}`, { observe: 'response'});
    }
}