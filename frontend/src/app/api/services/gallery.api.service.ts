import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import * as GalleryResponse from "../models/gallery-response.interface";
import { GalleryRoute } from "../routes/gallery.route.enum";
import { ArtGenre } from "../../shared/enums/art-genre.enum";
import { GalleryCreateRequest, GalleryUpdateRequest } from "../models/gallery-request.interface";
import { ArtMedium } from "../../shared/enums/art-medium.enum";
import { ArtTechnique } from "../../shared/enums/art-technique.enum";

@Injectable({
    providedIn: 'root'
})
export class GalleryAPIService {

    private idParam: string;
    private payloadCreate: GalleryCreateRequest;
    private payloadUpdate: GalleryUpdateRequest;

    private urlRefNrPreview: string;
    private urlGetOne: string;
    private urlGetAll: string;
    private urlCreate: string;
    private urlUpdate: string;
    private urlDelete: string;

    constructor(private readonly http: HttpClient) {
        this.idParam = '';
        this.payloadCreate = {
            imagePath: '',
            thumbnailPath: '',
            dimensions: '',
            artGenre: ArtGenre.abstract,
            artMedium: ArtMedium.canvas,
            artTechnique: ArtTechnique.acrylic,
            publication: new Date().getFullYear()
        };
        this.payloadUpdate = {
            id: '',
            referenceNr: '',
            imagePath: '',
            thumbnailPath: '',
            dimensions: '',
            artGenre: ArtGenre.abstract,
            artMedium: ArtMedium.canvas,
            artTechnique: ArtTechnique.acrylic,
            publication: new Date().getFullYear()
        };

        // this.urlGetOne = `/api/v1/gallery${GalleryRoute.findOne}`;
        // this.urlGetAll = `/api/v1/gallery${GalleryRoute.findAll}`;
        // this.urlCreate = `/api/v1/gallery${GalleryRoute.create}`;
        // this.urlUpdate = `/api/v1/gallery${GalleryRoute.update}`;
        // this.urlDelete = `/api/v1/gallery${GalleryRoute.delete}`;
        // this.urlRefNr = `/api/v1/gallery${GalleryRoute.refNrPreview}`;
        this.urlGetOne = `${environment.API_BASE_URL}/api/v1/gallery${GalleryRoute.findOne}`;
        this.urlGetAll = `${environment.API_BASE_URL}/api/v1/gallery${GalleryRoute.findAll}`;
        this.urlCreate = `${environment.API_BASE_URL}/api/v1/gallery${GalleryRoute.create}`;
        this.urlUpdate = `${environment.API_BASE_URL}/api/v1/gallery${GalleryRoute.update}`;
        this.urlDelete = `${environment.API_BASE_URL}/api/v1/gallery${GalleryRoute.delete}`;
        this.urlRefNrPreview = `${environment.API_BASE_URL}/api/v1/gallery${GalleryRoute.refNrPreview}`;
    }

    setIdParam(id: string) {
        this.idParam = id;
    }

    setCreatePayload(data: GalleryCreateRequest) {
        this.payloadCreate = {
            imagePath: data.imagePath,
            thumbnailPath: data.thumbnailPath,
            title: data.title,
            price: data.price,
            dimensions: data.dimensions,
            artGenre: data.artGenre,
            artMedium: data.artMedium,
            artTechnique: data.artTechnique,
            publication: data.publication
        };
    }

    setUpdatePayload(data: GalleryUpdateRequest) {
        this.payloadUpdate = {
            id: data.id,
            referenceNr: data.referenceNr,
            imagePath: data.imagePath,
            thumbnailPath: data.thumbnailPath,
            title: data.title,
            price: data.price,
            dimensions: data.dimensions,
            artGenre: data.artGenre,
            artMedium: data.artMedium,
            artTechnique: data.artTechnique,
            publication: data.publication
        };
    }

    sendGetOneRequest(): Observable<HttpResponse<GalleryResponse.GalleryItemResponse>> {
        return this.http.get<GalleryResponse.GalleryItemResponse>(`${this.urlGetOne}/${this.idParam}`, { observe: 'response'});
    }

    sendGetAllRequest(): Observable<HttpResponse<GalleryResponse.GalleryListResponse>> {
        return this.http.get<GalleryResponse.GalleryListResponse>(this.urlGetAll, { observe: 'response' });
    }

    sendCreateRequest(): Observable<HttpResponse<GalleryResponse.GalleryCreateUpdateResponse>> {
        return this.http.post<GalleryResponse.GalleryCreateUpdateResponse>(this.urlCreate, this.payloadCreate, { observe: 'response'});
    }

    sendUpdateRequest(): Observable<HttpResponse<GalleryResponse.GalleryCreateUpdateResponse>> {
        return this.http.put<GalleryResponse.GalleryCreateUpdateResponse>(this.urlUpdate, this.payloadUpdate, { observe: 'response'});
    }

    sendDeleteRequest(): Observable<HttpResponse<GalleryResponse.GalleryDeleteResponse>> {
        return this.http.delete<GalleryResponse.GalleryDeleteResponse>(`${this.urlDelete}/${this.idParam}`, { observe: 'response'});
    }

    sendRefNrPreviewRequest(genre: ArtGenre): Observable<HttpResponse<GalleryResponse.GalleryRefNrPreviewResponse>> {
        return this.http.get<GalleryResponse.GalleryRefNrPreviewResponse>(`${this.urlRefNrPreview}/${genre}`, { observe: 'response'});
    }

}