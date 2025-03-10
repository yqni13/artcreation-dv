import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router, RouterModule } from "@angular/router";
import { GalleryItemDEPRECATED } from "../../../shared/interfaces/GalleryItems";
import { ArtType } from "../../../shared/enums/art-type.enum";
import { DataShareService } from "../../../shared/services/data-share.service";
import { FilterGalleryService } from "../../../shared/services/filter-gallery.service";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { DimensionsFormatPipe } from "../../../common/pipes/dimensions-format.pipe";
import { FloatPrecisionPipe } from "../../../common/pipes/float-precision.pipe";
import { ImgFullscaleComponent } from "../../../common/components/img-fullscale/img-fullscale.component";
import { SubjectOptions } from "../../../shared/enums/contact-subject.enum";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'app-gallery-details',
    templateUrl: './gallery-details.component.html',
    styleUrl: './gallery-details.component.scss',
    imports: [
        CommonModule,
        DimensionsFormatPipe,
        FloatPrecisionPipe,
        ImgFullscaleComponent,
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

    protected card: GalleryItemDEPRECATED | null;

    protected artworkOption = ArtType;
    protected subject = SubjectOptions;
    protected galleryGenre: string;
    protected isFullscale: boolean;

    private id: string | null;
    private subscription$: Subscription;

    constructor(
        private filterGalleryService: FilterGalleryService,
        private dataShareService: DataShareService,
        private translate: TranslateService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.card = {
            title: null,
            referenceNr: '',
            genre: 'gallery',
            tags: null,
            price: null,
            type: ArtType.originalORprint,
            comment: null,
            technique: null,
            measurementsWxH: null,
            date: null,
            path: '',
            pathResized: ''
        };
        this.galleryGenre = 'gallery';
        this.isFullscale = false;
        this.id = '';
        this.subscription$ = new Subscription();

        // to get routing state, result only returns in constructor
        const currentNavigation = this.router.getCurrentNavigation()?.extras.state as {genre: string};
        if(currentNavigation !== undefined && currentNavigation !== null) {
            Object.values(currentNavigation).map((val) => {
                this.galleryGenre = val || 'gallery';
            });
        }
    }

    ngOnInit() {
        this.subscription$ = this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.card = this.filterGalleryService.filterByRefNr(this.id);
        })        
    }
    
    navigateFullscale(flag: boolean) {
        this.isFullscale = flag;
    }

    navigateToGallery() {
        this.router.navigate(['gallery'], { state: { genre: this.galleryGenre }});
    }

    navigateToContactWithData(subject: SubjectOptions) {
        const data = {
            'referenceNr': this.card?.referenceNr, 
            'type': this.card?.type,
            'subject': subject,
            'requestPrice': this.card?.price === 0 && this.card?.type !== ArtType.originalORprint ? true : false
        };
        
        this.dataShareService.setSharedData(data);
    }

    ngOnDestroy() {
        this.subscription$.unsubscribe();
    }
}