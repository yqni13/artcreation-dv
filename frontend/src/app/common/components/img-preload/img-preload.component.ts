import { Component, inject, input } from "@angular/core";
import { GalleryScrollDirective } from "../../directives/ng-scroll.directive";
import { Router } from "@angular/router";
import { GalleryItem } from "../../../api/interfaces/gallery-response.interface";
import { environment } from "../../../../environments/environment";
import { CacheCheckPipe } from "../../pipes/cache-check.pipe";

@Component({
    selector: "artdv-imgpreload",
    imports: [
        CacheCheckPipe,
        GalleryScrollDirective
    ],
    template: `
        <div
            class="artdv-gallery-cards-wrapper"
            id="artdv-loading-wrapper-{{entry().reference_nr}}"
            artdvGalleryScroll
            (preload)="setLoaded($event)"
        >
            @if (loaded) {
                <img
                    class="artdv-img-preview"
                    src="{{(storageDomain + '/' + entry().thumbnail_path) | cacheCheck: entry().last_modified}}"
                    alt="404-picture-not-found"
                    (click)="navigateToDetails(entry().reference_nr)"
                    (keydown.enter)="navigateToDetails(entry().reference_nr)"
                    [attr.aria-disabled]="true"
                >
            }
            @if (!loaded) {
                <img class="artdv-loading" src="/assets/loading.gif" alt="loading...">
            }
        </div>
    `,
    styleUrl: "./img-preload.component.scss"
})
export class ImgPreloadComponent {

    private readonly router = inject(Router);

    readonly entry = input.required<GalleryItem>();
    readonly activeGenre = input.required<string>();
    readonly artworkList = input.required<GalleryItem[]>();

    protected loaded = false;
    protected storageDomain = environment.STORAGE_URL.trim();

    setLoaded(flag: boolean) {
        this.loaded = flag;
    }

    navigateToDetails(refNr: string) {
        const stateData = {
            activeGenre: this.activeGenre(),
            artwork: this.entry(),
            artworkList: this.artworkList()
        }
        this.router.navigate(['gallery/detail', refNr], { state: stateData });
    }
}