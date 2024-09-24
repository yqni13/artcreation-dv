/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ArtworkOptions } from "../../shared/enums/artwork-option.enum";
import { default as galleryData } from "../../shared/data/gallery-data.json";
import { GalleryItem } from "../../shared/interfaces/GalleryItems";
import { ErrorService } from "../../shared/services/error.service";
import { CommonModule } from "@angular/common";
import { FilterGalleryService } from "../../shared/services/filter-gallery.service";
import { Router, RouterModule } from "@angular/router";
import { ImgPreloadComponent } from "../../common/components/img-preload/img-preload.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";


@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrl: './gallery.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        ImgPreloadComponent,
        RouterModule,
        TranslateModule
    ]
})
export class GalleryComponent implements OnInit, AfterViewInit {

    @ViewChild('gallerySection') gallerySection!: ElementRef;

    protected artworkOptions = ArtworkOptions;
    protected paintingsRaw: GalleryItem[];
    protected paintingsFiltered: Map<string, GalleryItem[]>;
    protected paintingsDisplayedByGenre: GalleryItem[];
    protected paintingGenres: string[];
    protected activeGenre: string;
    protected reloadFlag: boolean;

    constructor(
        private router: Router,
        private cdRef: ChangeDetectorRef,
        private errorService: ErrorService,
        private translate: TranslateService,
        private filterGalleryService: FilterGalleryService
    ) {
        try {
            this.paintingsRaw = galleryData;
        } catch(err) {
            this.errorService.handle(err);
            this.paintingsRaw = [];
        }        
        
        this.activeGenre = 'gallery';
        this.paintingGenres = [];
        this.paintingsDisplayedByGenre = []
        this.paintingsFiltered = new Map<string, GalleryItem[]>(); 
        this.reloadFlag = true;

        const currentNavigation = this.router.getCurrentNavigation()?.extras.state as any;        
        if(currentNavigation !== undefined && currentNavigation !== null) {
            Object.values(currentNavigation as {genre: string}).map((val) => {
                this.activeGenre = val || 'gallery';
            });
        }
    }
    
    ngOnInit() {
        this.paintingGenres = this.filterGalleryService.getGenres('ascending');
        this.paintingsFiltered = this.filterGalleryService.filterByGenre();
    }
    
    ngAfterViewInit() {
        // disable scrolling via mousewheel-(middle)click to prevent errors on img lazy/pre loads
        this.gallerySection.nativeElement.onmousedown = (e: any) => {
            if(e && (e.button === 1 || e.button === 4)) {
                e.preventDefault();
            }
        };

        this.selectGenre(this.activeGenre);
        this.cdRef.detectChanges();

        // TODO(yqni13): scrolling via custom scrollbar inside gallery component does not work on lazy/pre loads
    }

    navigateToDetail(id: string) {
        this.router.navigate(['gallery/detail', id], { state: {genre: this.activeGenre}});
    }

    selectGenre(genre: string) {
        this.activeGenre = '';
        this.reloadFlag = false;

        setTimeout(() => {
            this.activeGenre = genre;        
            if (genre === 'gallery') {
                this.paintingsDisplayedByGenre = this.paintingsRaw || [];
            } else {
                this.paintingsDisplayedByGenre = this.paintingsFiltered.get(this.activeGenre) || [];
            }           
            // necessary to destroy and rebuild img-preload comp, otherwise error of picture preload
            this.reloadFlag = true;
        }, 0);
    }
}