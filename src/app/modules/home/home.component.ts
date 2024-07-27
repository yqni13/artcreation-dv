import { Component, OnInit } from "@angular/core";
import { NewsUpdateStorageItem } from "../../shared/interfaces/NewsUpdateStorage";
import { default as newsUpdateData } from "../../shared/data/news-updates.json";
import { ErrorService } from "../../shared/services/error.service";
import { FilterNewsService } from "../../shared/services/filter-news.service";
import { NewsKeys } from "../../shared/enums/news-keys.enum";
import { CarouselComponent } from "../../common/components/carousel/carousel.component";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        CarouselComponent
    ]
})
export class HomeComponent implements OnInit {

    protected newsUpdates: NewsUpdateStorageItem;
    protected slides: {image: string, title: string, text: string}[] = [];

    constructor(
        private errorService: ErrorService,
        private filterNewsService: FilterNewsService
    ) {
        try {
            this.newsUpdates = newsUpdateData;
        } catch(err: unknown) {
            this.errorService.handle(err);
            this.newsUpdates = {};
        }

        this.slides = [];
    }
    
    ngOnInit() {
        this.filterNewsService.setSource(this.newsUpdates);
        this.filterNewsService.setCount(3);
        this.newsUpdates = this.filterNewsService.filterByTimestamp(NewsKeys.date);

        this.slides = Object.values(this.newsUpdates).map(entry => ({
            image: entry.image,
            title: entry.title,
            text: entry.text
        }));
    }

}