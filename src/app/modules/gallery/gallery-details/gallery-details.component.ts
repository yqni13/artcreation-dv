import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router, RouterModule } from "@angular/router";
import { GalleryItem } from "../../../shared/interfaces/GalleryItems";
import { ArtworkOptions } from "../../../shared/enums/artwork-option.enum";
import { DataShareService } from "../../../shared/services/data-share.service";
import { FilterGalleryService } from "../../../shared/services/filter-gallery.service";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { DimensionsFormatPipe } from "../../../common/pipes/dimensions-format.pipe";
import { FloatPrecisionPipe } from "../../../common/pipes/float-precision.pipe";

@Component({
    selector: 'app-gallery-details',
    templateUrl: './gallery-details.component.html',
    styleUrl: './gallery-details.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        DimensionsFormatPipe,
        FloatPrecisionPipe,
        RouterModule
    ]
})
export class GalleryDetailsComponent implements OnInit, OnDestroy {

    protected card: GalleryItem | null;

    protected artworkOption = ArtworkOptions;
    protected galleryGenre: string;
    protected isFullscale: boolean;

    private id: string | null;
    private subscription$: Subscription;

    constructor(
        private filterGalleryService: FilterGalleryService,
        private dataShareService: DataShareService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.card = {
            title: null,
            referenceNr: '',
            genre: 'gallery',
            tags: null,
            price: null,
            type: ArtworkOptions.originalANDprint,
            comment: null,
            technique: null,
            measurementsWxH: null,
            date: null,
            path: ''
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

    navigateFullscale(val: boolean) {
        this.isFullscale = val;
    }

    navigateToGallery() {
        this.router.navigate(['gallery'], { state: { genre: this.galleryGenre }});
    }

    navigateToContactWithData() {
        const data = {
            'referenceNr': this.card?.referenceNr, 
            'type': this.card?.type
        };
        
        this.dataShareService.setSharedData(data);
    }

    ngOnDestroy() {
        this.subscription$.unsubscribe();
    }
}