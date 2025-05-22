import { Component, OnInit } from "@angular/core";
import { FilterNewsService } from "../../shared/services/filter-news.service";
import { CarouselComponent } from "../../common/components/carousel/carousel.component";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { filter, Subscription, tap } from "rxjs";
import { HttpObservationService } from "../../shared/services/http-observation.service";
import { AuthService } from "../../shared/services/auth.service";
import { NewsAPIService } from "../../api/services/news.api.service";
import { NewsItemWGP } from "../../api/models/news-response.interface";
import { SortingOption } from "../../shared/enums/sorting-option.enum";

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

    protected newsCollection: NewsItemWGP[];
    protected imgPreloadCollection: any;
    protected isLoadingResponse: boolean;
    protected authorLink: string;

    private subscriptionHttpObservationFindAll$: Subscription;
    private subscriptionHttpObservationError$: Subscription;
    private delay: any;

    constructor(
        private readonly auth: AuthService,
        private readonly newsApi: NewsAPIService,
        private readonly filterNewsService: FilterNewsService,
        private readonly httpObservation: HttpObservationService,
    ) {
        this.newsCollection = [];
        this.isLoadingResponse = true;
        this.authorLink = 'https://pixabay.com/de/users/ds_30-1795490/';

        this.subscriptionHttpObservationFindAll$ = new Subscription();
        this.subscriptionHttpObservationError$ = new Subscription();
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    ngOnInit() {
        // Images are preloaded via ImgPreloadGuard (admin.routes.ts).

        this.subscriptionHttpObservationFindAll$ = this.httpObservation.newsFindAllWithGalleryPathsStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap(async (isStatus200: boolean) => {
                if(isStatus200) {
                    this.httpObservation.setGalleryFindAllStatus(false);
                    await this.delay(500); // delay after snackbar displays
                    this.isLoadingResponse = false;
                }
            })
        ).subscribe();

        this.subscriptionHttpObservationError$ = this.httpObservation.errorStatus$.pipe(
            filter((x) => x),
            tap(async (response: any) => {
                if(this.auth.getExceptionList().includes(response.error.headers.error)) {
                    this.httpObservation.setErrorStatus(false);
                    this.isLoadingResponse = false;
                }
            })
        ).subscribe();

        this.loadNewsList();
    }

    loadNewsList() {
        this.isLoadingResponse = true;
        this.newsApi.sendGetAllWithGalleryPathsRequest().subscribe(data => {
            this.newsCollection = data.body?.body.data ?? [];
            this.newsCollection = this.filterNewsService.filterByCount(3, this.newsCollection, SortingOption.DESC);
        })
    }

    ngOnDestroy() {
        this.subscriptionHttpObservationFindAll$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}