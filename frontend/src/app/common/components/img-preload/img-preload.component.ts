import { Component, Input } from "@angular/core";
import { GalleryScrollDirective } from "../../directives/ng-scroll.directive";
import { GalleryItem } from "../../../shared/interfaces/GalleryItems";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
    selector: "artdv-imgpreload",
    template: `
        <div 
            class="artdv-gallery-cards-wrapper" 
            id="artdv-loading-wrapper-{{card.referenceNr}}"
            artdvGalleryScroll
            (preload)="setLoaded($event)"
        >
            <img 
                *ngIf="loaded"
                class="artdv-img-preview"
                src="{{card.pathResized}}" 
                alt="404-picture-not-found"
                (click)="navigateToDetail(card.referenceNr)"
                (keydown.enter)="navigateToDetail(card.referenceNr)"
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