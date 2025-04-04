import { Component, OnInit } from "@angular/core";
import { NewsUpdateStorage } from "../../shared/interfaces/NewsUpdateStorage";
import { FilterNewsService } from "../../shared/services/filter-news.service";
import { NewsKeys } from "../../shared/enums/news-keys.enum";
import { CarouselComponent } from "../../common/components/carousel/carousel.component";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    imports: [
        CommonModule,
        CarouselComponent,
        TranslateModule
    ]
})
export class HomeComponent implements OnInit {

    protected slides: NewsUpdateStorage[];
    protected authorLink: string;
    protected imgPreloadCollection: any;

    constructor(
        private readonly filterNewsService: FilterNewsService
    ) {
        this.slides = [];
        this.authorLink = 'https://pixabay.com/de/users/alexey_marcov-8003626/';
    }
    
    ngOnInit() {
        this.preloadImgOnDirectAccess();
        this.slides = this.filterNewsService.filterByCount(3, NewsKeys.dateAscending);
    }

    preloadImgOnDirectAccess() {
        this.imgPreloadCollection = {
            about1: new Image(),
            about2: new Image(),
            about3: new Image()
        }
        this.imgPreloadCollection.about1.src = '/assets/about/about_01.webp';
        this.imgPreloadCollection.about2.src = '/assets/about/about_02.webp';
        this.imgPreloadCollection.about3.src = '/assets/about/about_03.webp';
    }
}