import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { DateFormatPipe } from "../../common/pipes/date-format.pipe";
import { NewsUpdateStorage } from "../../shared/interfaces/NewsUpdateStorage";
import { FilterNewsService } from "../../shared/services/filter-news.service";
import { NewsKeys } from "../../shared/enums/news-keys.enum";
import { ImgFullscaleComponent } from "../../common/components/img-fullscale/img-fullscale.component";


@Component({
    selector: 'app-archive',
    templateUrl: './archive.component.html',
    styleUrl: './archive.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        DateFormatPipe,
        ImgFullscaleComponent
    ]
})
export class ArchiveComponent implements OnInit {

    protected newsCollection: NewsUpdateStorage[]
    protected isFullscale: boolean;
    protected currentPath: string;

    constructor(private filterNewsService: FilterNewsService) {
        this.newsCollection = [];
        this.isFullscale = false;
        this.currentPath = '';
    }

    ngOnInit() {
        this.newsCollection = this.filterNewsService.filterByKeyValue(NewsKeys.dateAscending);
    }

    navigateFullscale(flag: boolean, path?: string) {
        this.isFullscale = flag;
        this.currentPath = path ?? this.currentPath;
    }
}