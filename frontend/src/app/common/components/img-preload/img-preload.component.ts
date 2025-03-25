import { Component, Input } from "@angular/core";
import { GalleryScrollDirective } from "../../directives/ng-scroll.directive";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { GalleryItem } from "../../../api/models/gallery-response.interface";
import { environment } from "../../../../environments/environment";

@Component({
    selector: "artdv-imgpreload",
    template: `
        <div 
            class="artdv-gallery-cards-wrapper" 
            id="artdv-loading-wrapper-{{entry.reference_nr}}"
            artdvGalleryScroll
            (preload)="setLoaded($event)"
        >
            <img 
                *ngIf="loaded"
                class="artdv-img-preview"
                src="{{storageDomain + '/' + entry.thumbnail_path}}" 
                alt="404-picture-not-found"
                (click)="navigateToDetails(entry.reference_nr)"
                (keydown.enter)="navigateToDetails(entry.reference_nr)"
                [attr.aria-disabled]="true"
            >
            <img *ngIf="!loaded" class="artdv-loading" src="/assets/loading.gif" alt="loading...">
            
        </div>
    `,
    styleUrl: "./img-preload.component.scss",
    imports: [
        CommonModule,
        GalleryScrollDirective
    ]
})
export class ImgPreloadComponent {

    @Input() entry!: GalleryItem;
    @Input() activeGenre!: string;

    protected loaded: boolean;
    protected storageDomain: string;

    constructor(
        private readonly router: Router
    ) {
        this.loaded = false;
        this.storageDomain = environment.STORAGE_URL;
    }

    setLoaded(flag: boolean) {
        this.loaded = flag;
    }

    navigateToDetails(refNr: string) {
        const stateData = {
            activeGenre: this.activeGenre,
            artwork: this.entry
        }
        this.router.navigate(['gallery/detail', refNr], { state: stateData });
    }
}