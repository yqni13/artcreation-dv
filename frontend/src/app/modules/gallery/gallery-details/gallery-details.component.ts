import { Component, HostListener, OnInit } from "@angular/core";
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

@Component({
    selector: 'app-gallery-details',
    templateUrl: './gallery-details.component.html',
    styleUrl: './gallery-details.component.scss',
    imports: [
        CommonModule,
        FloatPrecisionPipe,
        ImgFullscaleComponent,
        LowerUpperTextPipe,
        RouterModule,
        TranslateModule,
    ]
})
export class GalleryDetailsComponent implements OnInit {

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

    constructor(
        private dataShareService: DataShareService,
        private router: Router,
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
        
    }

    ngOnInit() {
        if(this.currentNavigation !== undefined && this.currentNavigation !== null) {
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
            'requestPrice': this.artwork.price === 0 ? true : false
        };
        
        this.dataShareService.setSharedData(data);
    }
}