/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { DataShareService } from "../../../shared/services/data-share.service";
import { CommonModule } from "@angular/common";
import { FloatPrecisionPipe } from "../../../common/pipes/float-precision.pipe";
import { ImgFullscaleComponent } from "../../../common/components/img-fullscale/img-fullscale.component";
import { SubjectOptions } from "../../../shared/enums/contact-subject.enum";
import { TranslateModule } from "@ngx-translate/core";
import { GalleryItem } from "../../../api/interfaces/gallery-response.interface";
import { LowerUpperTextPipe } from "../../../common/pipes/lower-upper.pipe";
import { environment } from "../../../../environments/environment";
import { ArtMedium } from "../../../shared/enums/art-medium.enum";
import { ArtTechnique } from "../../../shared/enums/art-technique.enum";
import { SaleStatus } from "../../../shared/enums/sale-status.enum";
import { ArtGenre } from "../../../shared/enums/art-genre.enum";
import { filter, Subscription, tap } from "rxjs";
import { HttpObservationService } from "../../../shared/services/http-observation.service";
import { AuthService } from "../../../shared/services/auth.service";
import { GalleryAPIService } from "../../../api/services/gallery.api.service";
import { LoadingAnimationComponent } from "../../../common/components/animation/loading/loading-animation.component";
import { CacheCheckPipe } from "../../../common/pipes/cache-check.pipe";
import { ArtFrame } from "../../../shared/enums/art-frame.enum";
import { ImgFrameComponent } from "../../../common/components/img-frame/img-frame.component";

@Component({
    selector: 'app-gallery-details',
    imports: [
        CacheCheckPipe,
        CommonModule,
        FloatPrecisionPipe,
        ImgFrameComponent,
        ImgFullscaleComponent,
        LoadingAnimationComponent,
        LowerUpperTextPipe,
        RouterModule,
        TranslateModule,
    ],
    templateUrl: './gallery-details.component.html',
    styleUrl: './gallery-details.component.scss',
    host: {
        '(document:keydown)': 'closeOnEscape($event)'
    }
})
export class GalleryDetailsComponent implements OnInit, OnDestroy {

    private readonly router = inject(Router);
    private readonly auth = inject(AuthService);
    private readonly galleryApi = inject(GalleryAPIService);
    private readonly dataShareService = inject(DataShareService);
    private readonly httpObservation = inject(HttpObservationService);

    protected artGenre = ArtGenre;
    protected artMedium = ArtMedium;
    protected artTechnique = ArtTechnique;
    protected saleStatus = SaleStatus;

    protected artwork: GalleryItem = this.initArtwork();
    protected artworkList: GalleryItem[] = [];
    protected authorLink = 'https://pixabay.com/de/users/stocksnap-894430/';
    protected subject = SubjectOptions;
    protected galleryGenre = 'gallery';
    protected isFullscale = false;
    protected isLoadingResponse = false;
    protected storageDomain = environment.STORAGE_URL.trim();

    private subscriptionHttpObservationError$ = new Subscription();
    private subscriptionHttpObservationFindAll$ = new Subscription();
    private delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    private currentNavigation = this.router.currentNavigation()?.extras.state as any;

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
        
        if(!this.currentNavigation || !this.currentNavigation?.artwork) {
            this.isLoadingResponse = true;
            this.galleryApi.sendGetAllRequest().subscribe(data => {
                this.artworkList = data.body?.body.data ?? [];
                // cover case of direct url navigation 
                // f.e.: /gallery/detail/refNr doesnt hold data for currentNavigation at all
                const filteredArtwork =  !this.currentNavigation
                    ? this.artworkList.find(entry => entry.reference_nr === (this.router.url.substring(this.router.url.length - 6, this.router.url.length)))
                    : this.artworkList.find(entry => entry.reference_nr === this.currentNavigation.refNr);
                this.artwork = filteredArtwork ?? this.artwork;
                this.galleryGenre = this.currentNavigation?.genre ?? 'all';
            });
        } else if(this.currentNavigation !== undefined && this.currentNavigation !== null) {
            this.galleryGenre = this.currentNavigation.activeGenre;
            this.artwork = this.currentNavigation.artwork;
            this.artworkList = this.currentNavigation.artworkList;
        }
    }

    closeOnEscape(event: KeyboardEvent) {
        if(event.key === 'Escape' && !this.isFullscale) {
            this.navigateToGallery();
        }
    }

    navigateFullscale(flag: boolean) {
        this.isFullscale = flag;
    }

    navigateToGallery() {
        this.router.navigate(['gallery'], { state: { genre: this.galleryGenre, artworkList: this.artworkList }});
    }

    navigateToContactWithData(subject: SubjectOptions) {
        const data = {
            'referenceNr': this.artwork?.reference_nr, 
            'subject': subject,
            'requestPrice': this.artwork?.price !== null ? `EUR ${this.artwork?.price}` : null
        };

        this.dataShareService.setSharedData(data);
    }

    private initArtwork(): GalleryItem {
        return {
            gallery_id: '',
            reference_nr: '',
            image_path: '',
            thumbnail_path: '',
            title: '',
            sale_status: '',
            price: undefined,
            dimensions: '',
            art_genre: ArtGenre.NATURE,
            art_medium: ArtMedium.OTHER,
            art_technique: ArtTechnique.OTHER,
            art_frame_model: ArtFrame.DEFAULT,
            art_frame_color: '#ffffff',
            publication_year: new Date().getFullYear(),
            created_on: '',
            last_modified: ''
        };
    }

    ngOnDestroy() {
        this.subscriptionHttpObservationFindAll$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}