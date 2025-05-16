import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { NewsRoute } from "../routes/news.route.enum";
import {
    NewsItemResponse,
    NewsListResponse,
    NewsCreateUpdateResponse,
    NewsDeleteResponse
} from "../models/news-response.interface"
import { Observable } from "rxjs";
import { NewsCreateRequest, NewsUpdateRequest } from "../models/news-request.interface";

@Injectable({
    providedIn: 'root'
})
export class NewsAPIService {

    private idParam: string;
    private formDataCreate: FormData;
    private formDataUpdate: FormData;

    private domainPathV1: string;
    private urlGetOneWithGalleryPaths: string;
    private urlGetAllWithGalleryPaths: string;
    private urlCreate: string;
    private urlUpdate: string;
    private urlDelete: string;

    private urlGetOne: string;
    private urlGetAll: string;

    constructor(private readonly http: HttpClient) {
        this.idParam = '';
        this.formDataCreate = new FormData();
        this.formDataUpdate = new FormData();

        this.domainPathV1 = '/api/v1/news';
        this.urlGetOneWithGalleryPaths = `${environment.API_BASE_URL}${this.domainPathV1}/${NewsRoute.FINDONEWGP}`;
        this.urlGetAllWithGalleryPaths = `${environment.API_BASE_URL}${this.domainPathV1}/${NewsRoute.FINDALLWGP}`;
        this.urlCreate = `${environment.API_BASE_URL}${this.domainPathV1}/${NewsRoute.CREATE}`;
        this.urlUpdate = `${environment.API_BASE_URL}${this.domainPathV1}/${NewsRoute.UPDATE}`;
        this.urlDelete = `${environment.API_BASE_URL}${this.domainPathV1}/${NewsRoute.DELETE}`;
        
        this.urlGetOne = `${environment.API_BASE_URL}${this.domainPathV1}/${NewsRoute.FINDONE_Deprecated}`;
        this.urlGetAll = `${environment.API_BASE_URL}${this.domainPathV1}/${NewsRoute.FINDALL_Deprecated}`;
    }

    setIdParam(id: string) {
        this.idParam = id;
    }

    setCreatePayload(data: any) {
        const imageFile = data.imageFile;
        const payloadCreate: NewsCreateRequest = {
            galleryId: data.gallery_id === '' ? null : data.gallery_id,
            imagePath: data.imagePath === '' ? null : data.imagePath,
            thumbnailPath: data.thumbnailPath === '' ? null : data.thumbnailPath,
            title: data.title,
            content: data.content
        };
        this.formDataCreate = new FormData();
        this.formDataCreate.append('file', imageFile);
        this.formDataCreate.append('data', JSON.stringify(payloadCreate));
    }

    setUpdatePayload(data: any) {
        const payloadUpdate: NewsUpdateRequest = {
            id: data.news_id,
            galleryId: data.gallery_id === '' ? null : data.gallery_id,
            imagePath: data.imagePath === '' ? null : data.imagePath,
            thumbnailPath: data.thumbnailPath === '' ? null : data.thumbnailPath,
            title: data.title,
            content: data.content
        };
        this.formDataUpdate = new FormData();
        if(data.imageFile) {
            const imageFile = data.imageFile;
            this.formDataUpdate.append('file', imageFile);
        }
        this.formDataUpdate.append('data', JSON.stringify(payloadUpdate));
    }

    sendGetOneWithGalleryPathsRequest(): Observable<HttpResponse<NewsItemResponse>> {
        return this.http.get<NewsItemResponse>(`${this.urlGetOneWithGalleryPaths}/${this.idParam}`, { observe: 'response'});
    }

    sendGetAllWithGalleryPathsRequest(): Observable<HttpResponse<NewsListResponse>> {
        return this.http.get<NewsListResponse>(this.urlGetAllWithGalleryPaths, { observe: 'response' });
    }

    sendCreateRequest(): Observable<HttpResponse<NewsCreateUpdateResponse>> {
        return this.http.post<NewsCreateUpdateResponse>(this.urlCreate, this.formDataCreate, { observe: 'response'});
    }

    sendUpdateRequest(): Observable<HttpResponse<NewsCreateUpdateResponse>> {
        return this.http.put<NewsCreateUpdateResponse>(this.urlUpdate, this.formDataUpdate, { observe: 'response'});
    }

    sendDeleteRequest(): Observable<HttpResponse<NewsDeleteResponse>> {
        return this.http.delete<NewsDeleteResponse>(`${this.urlDelete}/${this.idParam}`, { observe: 'response'});
    }

    // TODO(yqni13): keep deprecated methods until 12/2025

    /**
     * 
     * @deprecated Use sendGetOneWithGalleryPaths instead.
     */
    sendGetOneRequest(): Observable<HttpResponse<NewsItemResponse>> {
        return this.http.get<NewsItemResponse>(`${this.urlGetOne}/${this.idParam}`, { observe: 'response'});
    }

    /**
     * 
     * @deprecated Use sendGetAllWithGalleryPaths instead.
     */
    sendGetAllRequest(): Observable<HttpResponse<NewsListResponse>> {
        return this.http.get<NewsListResponse>(this.urlGetAll, { observe: 'response' });
    }
}