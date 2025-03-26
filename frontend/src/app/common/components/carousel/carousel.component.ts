/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, TemplateRef } from '@angular/core';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { Router, RouterModule } from '@angular/router';
import { FilterGalleryService } from '../../../shared/services/filter-gallery.service';
import { NewsUpdateStorage } from '../../../shared/interfaces/NewsUpdateStorage';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'artdv-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
    imports: [
        CommonModule,
        DateFormatPipe,
        RouterModule,
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

    @Input() slides: NewsUpdateStorage[];
    @Input() slideTemplate?: TemplateRef<any>;

    currentIndex: number;

    constructor(
        private router: Router,
        private filterGalleryService: FilterGalleryService
    ) {
        this.slides = [];
        this.currentIndex = 0;
    }

    navigateToDetails(id: string | null) {
        if(id && !id.includes('-')) {
            const genre = this.filterGalleryService.filterByRefNrForGenre(id);
            this.router.navigate(['gallery/detail', id], { state: { genre: genre}});
        }
    }

    getTransform() {
        return `translateX(${-this.currentIndex * 100}%)`;
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    }
}
