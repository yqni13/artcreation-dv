import { Component, Input } from "@angular/core";
import { GalleryScrollDirective } from "../../directives/ng-scroll.directive";
import { GalleryItem } from "../../../shared/interfaces/GalleryItems";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
    selector: "agal-imgpreload",
    template: `
        <div 
            class="agal-gallery-cards-wrapper" 
            id="agal-loading-wrapper-{{card.referenceNr}}"
            agalGalleryScroll
            (preload)="setLoaded($event)"
        >
            <img 
                *ngIf="loaded"
                class="agal-img-preview"
                id="agal-img-{{card.referenceNr}}"                 
                src="{{card.pathResized}}" 
                alt="404-picture-not-found"
                (click)="navigateToDetail(card.referenceNr)"
                (keydown.enter)="navigateToDetail(card.referenceNr)"
                [attr.aria-disabled]="true"
            >
            <img *ngIf="!loaded" class="agal-loading" src="/assets/loading.gif" alt="loading...">
            
        </div>
    `,
    styleUrl: "./img-preload.component.scss",
    standalone: true,
    imports: [
        CommonModule,
        GalleryScrollDirective
    ]
})
export class ImgPreloadComponent {

    @Input() card!: GalleryItem;
    @Input() activeGenre!: string;

    protected loaded: boolean;

    constructor(private router: Router) {
        this.loaded = false;
    }

    setLoaded(flag: boolean) {
        this.loaded = flag;
    }

    navigateToDetail(id: string) {
        this.router.navigate(['gallery/detail', id], { state: { genre: this.activeGenre }});
    }
}