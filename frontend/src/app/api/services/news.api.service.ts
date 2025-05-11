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
    private urlGetOne: string;
    private urlGetAll: string;
    private urlCreate: string;
    private urlUpdate: string;
    private urlDelete: string;

    constructor(private readonly http: HttpClient) {
        this.idParam = '';
        this.formDataCreate = new FormData();
        this.formDataUpdate = new FormData();

        this.domainPathV1 = '/api/v1/news';
        this.urlGetOne = `${environment.API_BASE_URL}${this.domainPathV1}/${NewsRoute.FINDONE}`;
        this.urlGetAll = `${environment.API_BASE_URL}${this.domainPathV1}/${NewsRoute.FINDALL}`;
        this.urlCreate = `${environment.API_BASE_URL}${this.domainPathV1}/${NewsRoute.CREATE}`;
        this.urlUpdate = `${environment.API_BASE_URL}${this.domainPathV1}/${NewsRoute.UPDATE}`;
        this.urlDelete = `${environment.API_BASE_URL}${this.domainPathV1}/${NewsRoute.DELETE}`;
    }

    setIdParam(id: string) {
        this.idParam = id;
    }

    setCreatePayload(data: any) {
        const imageFile = data.imageFile;
        const payloadCreate: NewsCreateRequest = {
            gallery_id: data.gallery_id === '' ? null : data.gallery_id,
            imagePath: data.imagePath === '' ? null : data.imagePath,
            thumbnailPath: data.thumbnailPath === '' ? null : data.thumbnailPath,
            title: data.title,
            text: data.text
        };
        this.formDataCreate = new FormData();
        this.formDataCreate.append('file', imageFile);
        this.formDataCreate.append('data', JSON.stringify(payloadCreate));
    }

    setUpdatePayload(data: any) {
        const payloadUpdate: NewsUpdateRequest = {
            news_id: data.news_id,
            gallery_id: data.gallery_id === '' ? null : data.gallery_id,
            imagePath: data.imagePath === '' ? null : data.imagePath,
            thumbnailPath: data.thumbnailPath === '' ? null : data.thumbnailPath,
            title: data.title,
            text: data.text
        };
        this.formDataUpdate = new FormData();
        if(data.imageFile) {
            const imageFile = data.imageFile;
            this.formDataUpdate.append('file', imageFile);
        }
        this.formDataUpdate.append('data', JSON.stringify(payloadUpdate));
    }

    sendGetOneRequest(): Observable<HttpResponse<NewsItemResponse>> {
        return this.http.get<NewsItemResponse>(`${this.urlGetOne}/${this.idParam}`, { observe: 'response'});
    }

    sendGetAllRequest(): Observable<HttpResponse<NewsListResponse>> {
        return this.http.get<NewsListResponse>(this.urlGetAll, { observe: 'response' });
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
}