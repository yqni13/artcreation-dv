import { Component, Input } from "@angular/core";
import { GalleryItem } from "../../../shared/interfaces/GalleryItems";
import { PaintingOptions } from "../../../shared/enums/painting-option.enum";
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

    protected paintingOption = PaintingOptions;

    constructor() {
        this.card = {
            title: null,
            referenceNr: '',
            tags: null,
            price: null,
            type: PaintingOptions.both,
            comment: null,
            technique: null,
            measurementsWxH: null,
            date: null,
            path: ''
        };
    }
}