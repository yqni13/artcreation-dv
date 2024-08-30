import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { DateFormatPipe } from "../../common/pipes/date-format.pipe";
import { NewsUpdateStorage } from "../../shared/interfaces/NewsUpdateStorage";
import { FilterNewsService } from "../../shared/services/filter-news.service";
import { NewsKeys } from "../../shared/enums/news-keys.enum";


@Component({
    selector: 'app-archive',
    templateUrl: './archive.component.html',
    styleUrl: './archive.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        DateFormatPipe
    ]
})
export class ArchiveComponent implements OnInit {

    protected newsCollection: NewsUpdateStorage[]

    constructor(private filterNewsService: FilterNewsService) {
        this.newsCollection = [];
    }

    ngOnInit() {
        this.newsCollection = this.filterNewsService.filterByKeyValue(NewsKeys.dateAscending);
    }

}