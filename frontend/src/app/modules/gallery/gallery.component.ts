/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { ImgPreloadComponent } from "../../common/components/img-preload/img-preload.component";
import { TranslateModule } from "@ngx-translate/core";
import { ArtGenre } from "../../shared/enums/art-genre.enum";
import { GalleryAPIService } from "../../api/services/gallery.api.service";
import { filter, Subscription, tap } from "rxjs";
import { HttpObservationService } from "../../shared/services/http-observation.service";
import { AuthService } from "../../shared/services/auth.service";
import { GalleryItem } from "../../api/models/gallery-response.interface";
import { LoadingAnimationComponent } from "../../common/components/animation/loading/loading-animation.component";


@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrl: './gallery.component.scss',
    imports: [
        CommonModule,
        ImgPreloadComponent,
        LoadingAnimationComponent,
        RouterModule,
        TranslateModule
    ]
})
export class GalleryComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('gallerySection') gallerySection!: ElementRef;

    protected galleryList: GalleryItem[];
    protected modifiedList: GalleryItem[];
    protected artGenres = ArtGenre;
    protected activeGenre: string;
    protected reloadFlag: boolean;
    protected isLoadingResponse: boolean;

    private currentNavigation: any;
    private subscriptionHttpObservationFindAll$: Subscription;
    private subscriptionHttpObservationError$: Subscription;
    private imgPreloadDetailsBg: any;
    private delay: any;

    constructor(
        private router: Router,
        private cdRef: ChangeDetectorRef,
        private readonly auth: AuthService,
        private readonly galleryApi: GalleryAPIService,
        private readonly httpObservation: HttpObservationService
    ) {
        this.galleryList = [];
        this.modifiedList = [];
        this.activeGenre = 'gallery';
        this.reloadFlag = true;
        this.isLoadingResponse = true;

        this.subscriptionHttpObservationFindAll$ = new Subscription();
        this.subscriptionHttpObservationError$ = new Subscription();
        this.imgPreloadDetailsBg = new Image();
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

        this.currentNavigation = this.router.getCurrentNavigation()?.extras.state as any;
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
            // preconnect to avoid loading fail in server timeout (vercel wake-up problem)
            this.auth.preConnect().subscribe({
                complete: () => {
                    this.initGallery();
                }
            });
        } else {
            this.reuseGallery();
        }
        this.imgPreloadDetailsBg.src = '/assets/background/art-wall.jpg';
    }
    
    ngAfterViewInit() {
        // disable scrolling via mousewheel-(middle)click to prevent errors on img lazy/pre loads
        this.gallerySection.nativeElement.onmousedown = (e: any) => {
            if(e && (e.button === 1 || e.button === 4)) {
                e.preventDefault();
            }
        };

        this.cdRef.detectChanges();

        // TODO(yqni13): scrolling via custom scrollbar inside gallery component does not work on lazy/pre loads
    }

    initGallery() {
        this.isLoadingResponse = true;
        this.galleryApi.sendGetAllRequest().subscribe(data => {
            this.galleryList = data.body?.body.data ?? [];
            this.modifiedList = this.galleryList;            
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
            this.activeGenre = genre;
            if(genre !== 'gallery') {
                this.modifiedList = this.galleryList.filter(data => data.art_genre === genre);
            } else {
                this.modifiedList = this.galleryList;
            }
            // necessary to destroy and rebuild img-preload comp, otherwise error of picture preload
            this.reloadFlag = true;
        }, 0);
    }

    ngOnDestroy() {
        this.subscriptionHttpObservationFindAll$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}