import { Injectable } from "@angular/core";
import { GalleryFilterRequest } from "../models/gallery-request.interface";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import * as GalleryResponse from "../models/gallery-response.interface";
import { GalleryRoute } from "../routes/gallery.route.enum";

@Injectable({
    providedIn: 'root'
})
export class GalleryAPIService {

    private idParam: string;
    private filterParams: GalleryFilterRequest;

    private urlGetOne: string;
    private urlGetAll: string;
    private urlCreate: string;
    private urlUpdate: string;
    private urlDelete: string;

    constructor(private readonly http: HttpClient) {
        this.idParam = '';
        this.filterParams = {
            table: '',
            queryParams: {}
        }

        // this.urlGetOne = `/api/v1/gallery${GalleryRoute.findOne}`;
        // this.urlGetAll = `/api/v1/gallery${GalleryRoute.findAll}`;
        // this.urlCreate = `/api/v1/gallery${GalleryRoute.create}`;
        // this.urlUpdate = `/api/v1/gallery${GalleryRoute.update}`;
        // this.urlDelete = `/api/v1/gallery${GalleryRoute.delete}`;
        this.urlGetOne = `${environment.API_BASE_URL}/api/v1/gallery${GalleryRoute.findOne}`;
        this.urlGetAll = `${environment.API_BASE_URL}/api/v1/gallery${GalleryRoute.findAll}`;
        this.urlCreate = `${environment.API_BASE_URL}/api/v1/gallery${GalleryRoute.create}`;
        this.urlUpdate = `${environment.API_BASE_URL}/api/v1/gallery${GalleryRoute.update}`;
        this.urlDelete = `${environment.API_BASE_URL}/api/v1/gallery${GalleryRoute.delete}`;
    }

    setIdParam(id: string) {
        this.idParam = id;
    }

    setFilterParams(data: GalleryFilterRequest) {
        this.filterParams = data;
    }

    sendGetOneRequest(): Observable<HttpResponse<GalleryResponse.GalleryItemResponse>> {
        return this.http.get<GalleryResponse.GalleryItemResponse>(`${this.urlGetOne}/${this.idParam}`, { observe: 'response'});
    }

    sendGetAllRequest(): Observable<HttpResponse<GalleryResponse.GalleryListResponse>> {
        return this.http.get<GalleryResponse.GalleryListResponse>(this.urlGetAll, { observe: 'response' });
    }

    sendDeleteRequest(): Observable<HttpResponse<GalleryResponse.GalleryDeleteResponse>> {
        return this.http.delete<GalleryResponse.GalleryDeleteResponse>(`${this.urlDelete}/${this.idParam}`, { observe: 'response'});
    }
}