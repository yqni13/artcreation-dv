import { Component } from "@angular/core";
import { NewsUpdateStorageItem } from "../../shared/interfaces/NewsUpdateStorage";
import { default as newsUpdateData } from "../../shared/data/news-updates.json";
import { ErrorService } from "../../shared/services/error.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: true,
    imports: []
})
export class HomeComponent {

    private newsUpdates: NewsUpdateStorageItem;
    protected filteredNewsUpdates: NewsUpdateStorageItem; 

    constructor(
        private errorService: ErrorService
    ) {
        const dateAsString = '2024-07-24T00:00:00';
        const dateFromString = new Date(dateAsString);
        console.log("new date: ", dateFromString);

        this.filteredNewsUpdates = {};

        try {
            this.newsUpdates = newsUpdateData;
        } catch(err: unknown) {
            this.errorService.handle(err);
            this.newsUpdates = {};
        }
    }

}