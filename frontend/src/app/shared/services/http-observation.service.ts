import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HttpObservationService {

    private assetsFindOneStatusSubject = new BehaviorSubject<boolean>(false);
    private assetsFindAllStatusSubject = new BehaviorSubject<boolean>(false);
    private assetsCreateStatusSubject = new BehaviorSubject<boolean>(false);
    private assetsUpdateStatusSubject = new BehaviorSubject<boolean>(false);
    private assetsDeleteStatusSubject = new BehaviorSubject<boolean>(false);
    private galleryFindOneStatusSubject = new BehaviorSubject<boolean>(false);
    private galleryFindAllStatusSubject = new BehaviorSubject<boolean>(false);
    private galleryCreateStatusSubject = new BehaviorSubject<boolean>(false);
    private galleryUpdateStatusSubject = new BehaviorSubject<boolean>(false);
    private galleryDeleteStatusSubject = new BehaviorSubject<boolean>(false);
    private newsFindOneWithGalleryPathsStatusSubject = new BehaviorSubject<boolean>(false);
    private newsFindOneStatusSubject = new BehaviorSubject<boolean>(false);
    private newsFindAllWithGalleryPathsStatusSubject = new BehaviorSubject<boolean>(false);
    private newsFindAllStatusSubject = new BehaviorSubject<boolean>(false);
    private newsCreateStatusSubject = new BehaviorSubject<boolean>(false);
    private newsUpdateStatusSubject = new BehaviorSubject<boolean>(false);
    private newsDeleteStatusSubject = new BehaviorSubject<boolean>(false);
    private emailStatusSubject = new BehaviorSubject<boolean>(false);
    private loginStatusSubject = new BehaviorSubject<boolean>(false);
    private errorStatusSubject = new BehaviorSubject<any>(null);

    assetsFindOneStatus$ = this.assetsFindOneStatusSubject.asObservable();
    assetsFindAllStatus$ = this.assetsFindAllStatusSubject.asObservable();
    assetsCreateStatus$ = this.assetsCreateStatusSubject.asObservable();
    assetsUpdateStatus$ = this.assetsUpdateStatusSubject.asObservable();
    assetsDeleteStatus$ = this.assetsDeleteStatusSubject.asObservable();
    galleryFindOneStatus$ = this.galleryFindOneStatusSubject.asObservable();
    galleryFindAllStatus$ = this.galleryFindAllStatusSubject.asObservable();
    galleryCreateStatus$ = this.galleryCreateStatusSubject.asObservable();
    galleryUpdateStatus$ = this.galleryUpdateStatusSubject.asObservable();
    galleryDeleteStatus$ = this.galleryDeleteStatusSubject.asObservable();
    newsFindOneWithGalleryPathsStatus$ = this.newsFindOneWithGalleryPathsStatusSubject.asObservable();
    newsFindOneStatus$ = this.newsFindOneStatusSubject.asObservable();
    newsFindAllWithGalleryPathsStatus$ = this.newsFindAllWithGalleryPathsStatusSubject.asObservable();
    newsFindAllStatus$ = this.newsFindAllStatusSubject.asObservable();
    newsCreateStatus$ = this.newsCreateStatusSubject.asObservable();
    newsUpdateStatus$ = this.newsUpdateStatusSubject.asObservable();
    newsDeleteStatus$ = this.newsDeleteStatusSubject.asObservable();
    emailStatus$ = this.emailStatusSubject.asObservable();
    loginStatus$ = this.loginStatusSubject.asObservable();
    errorStatus$ = this.errorStatusSubject.asObservable();

    setAssetsFindOneStatus(isStatus200: boolean) {
        this.assetsFindOneStatusSubject.next(isStatus200);
    }

    setAssetsFindAllStatus(isStatus200: boolean) {
        this.assetsFindAllStatusSubject.next(isStatus200);
    }

    setAssetsCreateStatus(isStatus200: boolean) {
        this.assetsCreateStatusSubject.next(isStatus200);
    }

    setAssetsUpdateStatus(isStatus200: boolean) {
        this.assetsUpdateStatusSubject.next(isStatus200);
    }

    setAssetsDeleteStatus(isStatus200: boolean) {
        this.assetsDeleteStatusSubject.next(isStatus200);
    }
    
    setGalleryFindOneStatus(isStatus200: boolean) {
        this.galleryFindOneStatusSubject.next(isStatus200);
    }

    setGalleryFindAllStatus(isStatus200: boolean) {
        this.galleryFindAllStatusSubject.next(isStatus200);
    }

    setGalleryCreateStatus(isStatus200: boolean) {
        this.galleryCreateStatusSubject.next(isStatus200);
    }

    setGalleryUpdateStatus(isStatus200: boolean) {
        this.galleryUpdateStatusSubject.next(isStatus200);
    }

    setGalleryDeleteStatus(isStatus200: boolean) {
        this.galleryDeleteStatusSubject.next(isStatus200);
    }

    setNewsFindOneWithGalleryPathsStatus(isStatus200: boolean) {
        this.newsFindOneWithGalleryPathsStatusSubject.next(isStatus200);
    }

    setNewsFindOneStatus(isStatus200: boolean) {
        this.newsFindOneStatusSubject.next(isStatus200);
    }

    setNewsFindAllWithGalleryPathsStatus(isStatus200: boolean) {
        this.newsFindAllWithGalleryPathsStatusSubject.next(isStatus200);
    }

    setNewsFindAllStatus(isStatus200: boolean) {
        this.newsFindAllStatusSubject.next(isStatus200);
    }

    setNewsCreateStatus(isStatus200: boolean) {
        this.newsCreateStatusSubject.next(isStatus200);
    }

    setNewsUpdateStatus(isStatus200: boolean) {
        this.newsUpdateStatusSubject.next(isStatus200);
    }

    setNewsDeleteStatus(isStatus200: boolean) {
        this.newsDeleteStatusSubject.next(isStatus200);
    }

    setEmailStatus(isStatus200: boolean) {
        this.emailStatusSubject.next(isStatus200);
    }

    setLoginStatus(isStatus200: boolean) {
        this.loginStatusSubject.next(isStatus200);
    }

    setErrorStatus(error: any) {
        this.errorStatusSubject.next(error);
    }
}