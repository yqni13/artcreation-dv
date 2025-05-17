/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, TemplateRef } from '@angular/core';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BaseRoute } from '../../../api/routes/base.route.enum';
import { NewsItemWGP } from '../../../api/models/news-response.interface';
import { environment } from '../../../../environments/environment';
import { LoadingAnimationComponent } from '../animation/loading/loading-animation.component';
import { SizeOption } from '../../../shared/enums/size-option.enum';

@Component({
    selector: 'artdv-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
    imports: [
        CommonModule,
        DateFormatPipe,
        RouterModule,
        LoadingAnimationComponent,
        TranslateModule
    ]
})
export class CarouselComponent {

    @HostListener('window:keydown', ['$event'])
    isNavigatingCarousel(event: KeyboardEvent) {
        if(event.key === 'ArrowRight') {
            this.next();
        } else if(event.key === 'ArrowLeft') {
            this.prev();
        }
    }

    @Input() entries: NewsItemWGP[];
    @Input() isLoadingResponse!: boolean;
    @Input() slideTemplate?: TemplateRef<any>;

    protected baseRoute = BaseRoute;
    protected storageDomain: string;
    protected SizeOptionEnum = SizeOption;

    currentIndex: number;

    constructor(
        private router: Router
    ) {
        this.entries = [];
        this.currentIndex = 0;
        this.storageDomain = environment.STORAGE_URL;
    }

    navigateToDetails(entry: NewsItemWGP | null) {
        if(entry) {
            this.router.navigate(['gallery/detail', entry.reference_nr_gallery], { state: {
                refNr: entry.reference_nr_gallery,
                genre: entry.art_genre_gallery
            }});
        } else {
            this.router.navigate([BaseRoute.ARCHIVE]);
        }

    }

    getTransform() {
        return `translateX(${-this.currentIndex * 100}%)`;
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.entries.length;
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.entries.length) % this.entries.length;
    }
}
