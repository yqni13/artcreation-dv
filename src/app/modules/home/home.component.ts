import { Component, OnInit } from "@angular/core";
import { NewsUpdateStorageItem } from "../../shared/interfaces/NewsUpdateStorage";
import { default as newsUpdateData } from "../../shared/data/news-updates.json";
import { ErrorService } from "../../shared/services/error.service";
import { FilterNewsService } from "../../shared/services/filter-news.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: true,
    imports: []
})
export class HomeComponent implements OnInit {

    protected newsUpdates: NewsUpdateStorageItem;

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
    }
    
    ngOnInit() {
        this.filterNewsService.setSource(this.newsUpdates);
        this.filterNewsService.setCount(3);
        this.newsUpdates = this.filterNewsService.filterByTimestamp();
    }

}