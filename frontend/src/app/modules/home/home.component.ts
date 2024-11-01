import { Component, OnInit } from "@angular/core";
import { NewsUpdateStorage } from "../../shared/interfaces/NewsUpdateStorage";
import { FilterNewsService } from "../../shared/services/filter-news.service";
import { NewsKeys } from "../../shared/enums/news-keys.enum";
import { CarouselComponent } from "../../common/components/carousel/carousel.component";
import { CommonModule } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        CarouselComponent,
        TranslateModule
    ]
})
export class HomeComponent implements OnInit {

    protected slides: NewsUpdateStorage[];

    constructor(
        private filterNewsService: FilterNewsService,
        private translate: TranslateService
    ) {
        this.slides = [];
    }
    
    ngOnInit() {
        this.slides = this.filterNewsService.filterByCount(3, NewsKeys.dateAscending);
    }

}