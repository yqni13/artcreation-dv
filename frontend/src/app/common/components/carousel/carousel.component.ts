import { CommonModule } from '@angular/common';
import { Component, inject, input, TemplateRef } from '@angular/core';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BaseRoute } from '../../../api/routes/base.route.enum';
import { NewsItemWGP } from '../../../api/interfaces/news-response.interface';
import { environment } from '../../../../environments/environment';
import { LoadingAnimationComponent } from '../animation/loading/loading-animation.component';
import { SizeOption } from '../../../shared/enums/size-option.enum';
import { CacheCheckPipe } from '../../pipes/cache-check.pipe';

@Component({
    selector: 'artdv-carousel',
    imports: [
        CacheCheckPipe,
        CommonModule,
        DateFormatPipe,
        RouterModule,
        LoadingAnimationComponent,
        TranslateModule
    ],
    templateUrl: './carousel.component.html',
    styleUrl: './carousel.component.scss',
    host: {
        '(window:keydown)': 'isNavigatingCarousel($event)'
    }
})
export class CarouselComponent {

    private router = inject(Router);

    readonly entries = input<NewsItemWGP[]>([]);
    readonly isLoadingResponse = input<boolean>();
    readonly slideTemplate = input<TemplateRef<unknown>>();

    protected baseRoute = BaseRoute;
    protected storageDomain = environment.STORAGE_URL.trim();
    protected SizeOptionEnum = SizeOption;

    currentIndex = 0;

    navigateToDetails(entry: NewsItemWGP | null) {
        if(entry) {
            this.router.navigate([`${BaseRoute.GALLERY}/detail`, entry.reference_nr_gallery], { state: {
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
        this.currentIndex = !this.isLoadingResponse()
            ? ((this.currentIndex + 1) % this.entries().length)
            : this.currentIndex;
    }

    prev() {
        this.currentIndex = !this.isLoadingResponse() 
            ? ((this.currentIndex - 1 + this.entries().length) % this.entries().length)
            : this.currentIndex;
    }

    isNavigatingCarousel(event: KeyboardEvent) {
        if(event.key === 'ArrowRight') {
            this.next();
        } else if(event.key === 'ArrowLeft') {
            this.prev();
        }
    }
}
