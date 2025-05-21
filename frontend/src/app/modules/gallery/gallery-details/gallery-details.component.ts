import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { DataShareService } from "../../../shared/services/data-share.service";
import { CommonModule } from "@angular/common";
import { FloatPrecisionPipe } from "../../../common/pipes/float-precision.pipe";
import { ImgFullscaleComponent } from "../../../common/components/img-fullscale/img-fullscale.component";
import { SubjectOptions } from "../../../shared/enums/contact-subject.enum";
import { TranslateModule } from "@ngx-translate/core";
import { GalleryItem } from "../../../api/models/gallery-response.interface";
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

@Component({
    selector: 'app-gallery-details',
    templateUrl: './gallery-details.component.html',
    styleUrl: './gallery-details.component.scss',
    imports: [
        CacheCheckPipe,
        CommonModule,
        FloatPrecisionPipe,
        ImgFullscaleComponent,
        LoadingAnimationComponent,
        LowerUpperTextPipe,
        RouterModule,
        TranslateModule,
    ]
})
export class GalleryDetailsComponent implements OnInit, OnDestroy {

    @HostListener('window:keydown', ['$event'])
    closeOnEscape(event: KeyboardEvent) {
        if(event.key === 'Escape' && !this.isFullscale) {
            this.navigateToGallery();
        }
    }

    protected artGenre = ArtGenre;
    protected artMedium = ArtMedium;
    protected artTechnique = ArtTechnique;
    protected saleStatus = SaleStatus;

    protected artwork: GalleryItem;
    protected artworkList: GalleryItem[];
    protected authorLink: string;
    protected subject = SubjectOptions;
    protected galleryGenre: string;
    protected isFullscale: boolean;
    protected isLoadingResponse: boolean;
    protected storageDomain: string;

    private currentNavigation: any;
    private subscriptionHttpObservationError$: Subscription;
    private subscriptionHttpObservationFindAll$: Subscription;
    private delay: any;

    constructor(
        private readonly router: Router,
        private readonly auth: AuthService,
        private readonly galleryApi: GalleryAPIService,
        private readonly dataShareService: DataShareService,
        private readonly httpObservation: HttpObservationService,
    ) {
        this.artwork = {
            gallery_id: '',
            reference_nr: '',
            image_path: '',
            thumbnail_path: '',
            title: '',
            sale_status: '',
            price: undefined,
            dimensions: '',
            art_genre: '',
            art_medium: '',
            art_technique: '',
            publication_year: new Date().getFullYear(),
            created_on: '',
            last_modified: ''
        }
        this.artworkList = [];
        this.authorLink = 'https://pixabay.com/de/users/stocksnap-894430/';
        this.galleryGenre = 'gallery';
        this.isFullscale = false;
        this.isLoadingResponse = false;
        this.storageDomain = environment.STORAGE_URL;

        // to get routing state, result only returns in constructor
        this.currentNavigation = this.router.getCurrentNavigation()?.extras.state as {activeGenre: string, artwork: GalleryItem};
        
        this.subscriptionHttpObservationFindAll$ = new Subscription();
        this.subscriptionHttpObservationError$ = new Subscription();
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
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
                this.galleryGenre = this.currentNavigation.genre ?? 'all';
            });
        } else if(this.currentNavigation !== undefined && this.currentNavigation !== null) {
            this.galleryGenre = this.currentNavigation.activeGenre;
            this.artwork = this.currentNavigation.artwork;
            this.artworkList = this.currentNavigation.artworkList;
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

    ngOnDestroy() {
        this.subscriptionHttpObservationFindAll$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}