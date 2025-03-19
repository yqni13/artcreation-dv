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
    private formDataCreate: FormData;
    private payloadCreate: GalleryCreateRequest;
    private formDataUpdate: FormData;
    private payloadUpdate: GalleryUpdateRequest;

    private urlRefNrPreview: string;
    private urlGetOne: string;
    private urlGetAll: string;
    private urlCreate: string;
    private urlUpdate: string;
    private urlDelete: string;

    constructor(private readonly http: HttpClient) {
        this.idParam = '';
        this.formDataCreate = new FormData();
        this.payloadCreate = {
            imagePath: '',
            thumbnailPath: '',
            dimensions: '',
            artGenre: ArtGenre.abstract,
            artMedium: ArtMedium.canvas,
            artTechnique: ArtTechnique.acrylic,
            publication: new Date().getFullYear()
        };
        this.formDataUpdate = new FormData();
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
        this.urlGetOne = `${environment.API_BASE_URL}/api/v1/gallery${GalleryRoute.FINDONE}`;
        this.urlGetAll = `${environment.API_BASE_URL}/api/v1/gallery${GalleryRoute.FINDALL}`;
        this.urlCreate = `${environment.API_BASE_URL}/api/v1/gallery${GalleryRoute.CREATE}`;
        this.urlUpdate = `${environment.API_BASE_URL}/api/v1/gallery${GalleryRoute.UPDATE}`;
        this.urlDelete = `${environment.API_BASE_URL}/api/v1/gallery${GalleryRoute.DELETE}`;
        this.urlRefNrPreview = `${environment.API_BASE_URL}/api/v1/gallery${GalleryRoute.REFNRPREVIEW}`;
    }

    setIdParam(id: string) {
        this.idParam = id;
    }

    setCreatePayload(data: any) {
        const imageFile = data.imageFile;
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
        this.formDataCreate = new FormData(); // reset to avoid unwanted zombie data
        this.formDataCreate.append('file', imageFile);
        this.formDataCreate.append('data', JSON.stringify(this.payloadCreate));
    }

    setUpdatePayload(data: any) {
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
        this.formDataUpdate = new FormData();
        if(data.imageFile) {
            const imageFile = data.imageFile;
            this.formDataUpdate.append('file', imageFile);
        }
        this.formDataUpdate.append('data', JSON.stringify(this.payloadUpdate));
    }

    sendGetOneRequest(): Observable<HttpResponse<GalleryResponse.GalleryItemResponse>> {
        return this.http.get<GalleryResponse.GalleryItemResponse>(`${this.urlGetOne}/${this.idParam}`, { observe: 'response'});
    }

    sendGetAllRequest(): Observable<HttpResponse<GalleryResponse.GalleryListResponse>> {
        return this.http.get<GalleryResponse.GalleryListResponse>(this.urlGetAll, { observe: 'response' });
    }

    sendCreateRequest(): Observable<HttpResponse<GalleryResponse.GalleryCreateUpdateResponse>> {
        return this.http.post<GalleryResponse.GalleryCreateUpdateResponse>(this.urlCreate, this.formDataCreate, { observe: 'response'});
    }

    sendUpdateRequest(): Observable<HttpResponse<GalleryResponse.GalleryCreateUpdateResponse>> {
        return this.http.put<GalleryResponse.GalleryCreateUpdateResponse>(this.urlUpdate, this.formDataUpdate, { observe: 'response'});
    }

    sendDeleteRequest(): Observable<HttpResponse<GalleryResponse.GalleryDeleteResponse>> {
        return this.http.delete<GalleryResponse.GalleryDeleteResponse>(`${this.urlDelete}/${this.idParam}`, { observe: 'response'});
    }

    sendRefNrPreviewRequest(genre: ArtGenre): Observable<HttpResponse<GalleryResponse.GalleryRefNrPreviewResponse>> {
        return this.http.get<GalleryResponse.GalleryRefNrPreviewResponse>(`${this.urlRefNrPreview}/${genre}`, { observe: 'response'});
    }

}