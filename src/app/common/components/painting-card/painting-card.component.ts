import { DataShareService } from './../../../shared/services/data-share.service';
import { Component, Input } from "@angular/core";
import { GalleryItem } from "../../../shared/interfaces/GalleryItems";
import { ArtworkOptions } from "../../../shared/enums/artwork-option.enum";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'agal-paintingcard',
    templateUrl: './painting-card.component.html',
    styleUrl: './painting-card.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class PaintingCardComponent {

    @Input() card: GalleryItem;

    protected artworkOption = ArtworkOptions;

    constructor(private dataShareService: DataShareService) {
        this.card = {
            title: null,
            referenceNr: '',
            tags: null,
            price: null,
            type: ArtworkOptions.originalANDprint,
            comment: null,
            technique: null,
            measurementsWxH: null,
            date: null,
            path: ''
        };
    }

    routeWithData() {
        const data = {
            'referenceNr': this.card.referenceNr, 
            'type': this.card.type
        };
        
        this.dataShareService.setSharedData(data);
    }
}