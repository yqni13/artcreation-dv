import { Injectable } from "@angular/core";
import { GalleryFilterRequest } from "../models/gallery-request.interface";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import * as GalleryResponse from "../models/gallery-response.interface";

@Injectable({
    providedIn: 'root'
})
export class GalleryAPIService {

    private idParam: string;
    private filterParams: GalleryFilterRequest;

    private urlGetOne: string;
    private urlGetAll: string;
    private urlGetFiltered: string;

    constructor(private readonly http: HttpClient) {
        this.idParam = '';
        this.filterParams = {
            table: '',
            queryParams: {}
        }

        // this.urlGetOne = '/api/v1/gallery/findOne';
        // this.urlFindAll = '/api/v1/gallery/findAll';
        // this.urlGalleryFiltered = '/api/v1/gallery/filtered';
        this.urlGetOne = environment.API_BASE_URL + '/api/v1/gallery/findOne';
        this.urlGetAll = environment.API_BASE_URL + '/api/v1/gallery/findAll';
        this.urlGetFiltered = environment.API_BASE_URL + '/api/v1/gallery/filtered';
    }

    setIdParam(id: string) {
        this.idParam = id;
        this.urlGetOne = `${this.urlGetOne}/${this.idParam}`;
    }

    setFilterParams(data: GalleryFilterRequest) {
        this.filterParams = data;
    }

    sendGetOneRequest(): Observable<HttpResponse<GalleryResponse.GalleryItem>> {
        return this.http.get<GalleryResponse.GalleryItem>(this.urlGetOne, { observe: 'response'});
    }

    sendGetAllRequest(): Observable<HttpResponse<GalleryResponse.GalleryListResponse>> {
        return this.http.get<GalleryResponse.GalleryListResponse>(this.urlGetAll, { observe: 'response' });
    }

    sendGetFilteredRequest(): Observable<HttpResponse<GalleryResponse.GalleryListResponse>> {
        return this.http.post<GalleryResponse.GalleryListResponse>(this.urlGetFiltered, this.filterParams, { observe: 'response' });
    }

}