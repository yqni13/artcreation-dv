import { Component, OnInit } from "@angular/core";
import { ArtworkOptions } from "../../shared/enums/artwork-option.enum";
import { default as galleryData } from "../../shared/data/gallery-data.json";
import { GalleryItem } from "../../shared/interfaces/GalleryItems";
import { ErrorService } from "../../shared/services/error.service";
import { PaintingCardComponent } from "../../common/components/painting-card/painting-card.component";
import { CommonModule } from "@angular/common";
import { FilterGalleryService } from "../../shared/services/filter-gallery.service";

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrl: './gallery.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        PaintingCardComponent
    ]
})
export class GalleryComponent implements OnInit {

    protected artworkOptions = ArtworkOptions;
    protected paintingsRaw: GalleryItem[];
    protected paintingsFiltered: Map<string, GalleryItem[]>;
    protected paintingsDisplayedByGenre: GalleryItem[];
    protected paintingGenres: string[];
    protected activeGenre: string;

    constructor(
        private errorService: ErrorService,
        private filterGalleryService: FilterGalleryService
    ) {
        try {
            this.paintingsRaw = galleryData;
        } catch(err) {
            this.errorService.handle(err);
            this.paintingsRaw = [];
        }        
        
        this.activeGenre = 'all';
        this.paintingGenres = [];
        this.paintingsDisplayedByGenre = []
        this.paintingsFiltered = new Map<string, GalleryItem[]>();        
    }
    
    ngOnInit() {
        this.paintingGenres = this.filterGalleryService.getGenres(this.paintingsRaw);
        this.paintingsFiltered = this.filterGalleryService.filterByGenre(this.paintingsRaw);
        this.selectGenre(this.activeGenre);
    }

    selectGenre(genre: string) {
        this.activeGenre = genre;
        if(genre === 'all') {
            this.paintingsDisplayedByGenre = this.paintingsRaw || [];
        } else {
            this.paintingsDisplayedByGenre = this.paintingsFiltered.get(this.activeGenre) || [];
        }
    }
}