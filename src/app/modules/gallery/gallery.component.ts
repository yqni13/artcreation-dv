import { Component } from "@angular/core";
import { PaintingOptions } from "../../shared/enums/painting-option.enum";
import { default as galleryData } from "../../shared/data/gallery-data.json";
import { GalleryItem, GalleryItemCollection } from "../../shared/interfaces/GalleryItems";
import { ErrorService } from "../../shared/services/error.service";
import { PaintingCardComponent } from "../../common/components/painting-card/painting-card.component";
import { CommonModule } from "@angular/common";

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
export class GalleryComponent {

    protected paintingOptions = PaintingOptions;
    protected paintingsRaw: GalleryItemCollection;
    protected paintingsFiltered: GalleryItem[];

    constructor(
        private errorService: ErrorService
    ) {
        try {
            this.paintingsRaw = galleryData;
        } catch(err) {
            this.errorService.handle(err);
            this.paintingsRaw = {};
        }

        this.paintingsFiltered = Object.values(this.paintingsRaw).map(entry => ({
            title: entry.title,
            referenceNr: entry.referenceNr,
            tags: entry.tags,
            price: entry.price,
            type: entry.type,
            comment: entry.comment,
            technique: entry.technique,
            measurementsWxH: entry.measurementsWxH,
            date: entry.date,
            path: entry.path
        }));
    }

    // TODO(yqni13): add filter service to filter paintings
}