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

        this.subscriptionHttpObservationFindAll$ = new Subscription();
        this.subscriptionHttpObservationError$ = new Subscription();
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }
    
    ngOnInit() {
        this.preloadImgOnDirectAccess();
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
                    await this.delay(500); // delay after snackbar displays
                    this.httpObservation.setErrorStatus(false);
                    this.isLoadingResponse = false;
                }
            })
        ).subscribe();

        this.loadNewsList();
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