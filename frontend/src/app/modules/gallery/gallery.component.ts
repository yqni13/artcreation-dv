/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, effect, EffectCleanupRegisterFn, ElementRef, inject, OnDestroy, OnInit, viewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { ImgPreloadComponent } from "../../common/components/img-preload/img-preload.component";
import { TranslateModule } from "@ngx-translate/core";
import { ArtGenre } from "../../shared/enums/art-genre.enum";
import { GalleryAPIService } from "../../api/services/gallery.api.service";
import { filter, Subscription, tap } from "rxjs";
import { HttpObservationService } from "../../shared/services/http-observation.service";
import { AuthService } from "../../shared/services/auth.service";
import { GalleryItem } from "../../api/interfaces/gallery-response.interface";
import { LoadingAnimationComponent } from "../../common/components/animation/loading/loading-animation.component";
import { LocalStorageService } from "../../shared/services/localstorage.service";

@Component({
    selector: 'app-gallery',
    imports: [
        CommonModule,
        ImgPreloadComponent,
        LoadingAnimationComponent,
        RouterModule,
        TranslateModule
    ],
    templateUrl: './gallery.component.html',
    styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit, OnDestroy {

    private router = inject(Router);
    private readonly auth = inject(AuthService);
    private readonly galleryApi = inject(GalleryAPIService);
    private readonly httpObservation = inject(HttpObservationService);
    private readonly localstorageService = inject(LocalStorageService);

    private readonly gallerySection = viewChild<ElementRef>('gallerySection');

    protected galleryList: GalleryItem[] = [];
    protected modifiedList: GalleryItem[] = [];
    protected ArtGenreEnum = ArtGenre;
    protected activeGenre = '';
    protected reloadFlag = true;
    protected isLoadingResponse = true;

    private currentNavigation = this.router.currentNavigation()?.extras.state as any;
    private tokenIdGalleryFilter = 'local_gallery-filter';
    private subscriptionHttpObservationFindAll$ = new Subscription();
    private subscriptionHttpObservationError$ = new Subscription();
    private delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    constructor() {
        effect((onCleanUp) => {
            this.handleMouseWheelScroll(onCleanUp);
        })
    }

    ngOnInit() {
        this.subscriptionHttpObservationFindAll$ = this.httpObservation.galleryFindAllStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.httpObservation.setGalleryFindAllStatus(false);
                    this.isLoadingResponse = false;
                }
            })
        ).subscribe();

        this.subscriptionHttpObservationError$ = this.httpObservation.errorStatus$.pipe(
            filter((x) => x),
            tap(async (response: any) => {
                if(this.auth.getExceptionList().includes(response.error.headers.error)) {
                    await this.delay(500); // delay after snackbar displays
                    this.httpObservation.setErrorStatus(false);
                    this.isLoadingResponse = false;
                }
            })
        ).subscribe();

        if(!this.currentNavigation || this.currentNavigation.artworkList.length === 0) {
            // Preconnect to avoid loading fail in server timeout (vercel wake-up problem).
            this.auth.preConnect().subscribe({
                complete: () => {
                    this.initGallery();
                }
            });
        } else {
            this.reuseGallery();
        }
    }

    private handleMouseWheelScroll(onCleanUp: EffectCleanupRegisterFn) {
        const element = this.gallerySection()?.nativeElement;
        if(!element) {
            return;
        }

        const mouseDownHandler = (e: any) => {
            // Disable scrolling via mousewheel-(middle)click to prevent errors on img lazy/pre loads.
            if(e && (e.button === 1 || e.button === 4)) {
                e.preventDefault();
            }
        };
        element.addEventListener('mousedown', mouseDownHandler);
        onCleanUp(() => {
            element.removeEventListener('mousedown', mouseDownHandler);
        });
    }

    initGallery() {
        this.isLoadingResponse = true;
        this.galleryApi.sendGetAllRequest().subscribe(data => {
            this.galleryList = data.body?.body.data ?? [];
            this.modifiedList = this.galleryList;
            const token = this.localstorageService.getItem<string>(this.tokenIdGalleryFilter);
            if(!token) {
                this.localstorageService.setItem<string>(this.tokenIdGalleryFilter, '');
            } else {
                this.onGenreChange(token);
            }
        })
    }

    async reuseGallery() {
        this.galleryList = this.currentNavigation.artworkList;
        this.onGenreChange(this.currentNavigation.genre || 'gallery');
        await this.delay(150);
        this.isLoadingResponse = false;
    }

    onGenreChange(genre: string) {
        this.activeGenre = '';
        this.reloadFlag = false;
        setTimeout(() => {
            const tokenValueGalleryFilter = this.localstorageService.getItem<string>(this.tokenIdGalleryFilter);
            this.activeGenre = genre;
            if(!tokenValueGalleryFilter || tokenValueGalleryFilter !== genre) {
                this.localstorageService.removeItem(this.tokenIdGalleryFilter, false);
                this.localstorageService.setItem<string>(this.tokenIdGalleryFilter, genre);
            }
            if(genre !== 'gallery') {
                this.modifiedList = this.galleryList.filter(data => data.art_genre === genre);
            } else {
                this.modifiedList = this.galleryList;
            }
            // Necessary to destroy and rebuild img-preload comp, otherwise error of picture preload.
            this.reloadFlag = true;
        }, 0);
    }

    ngOnDestroy() {
        this.subscriptionHttpObservationFindAll$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}