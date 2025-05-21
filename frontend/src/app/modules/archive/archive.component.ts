import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { DateFormatPipe } from "../../common/pipes/date-format.pipe";
import { ImgFullscaleComponent } from "../../common/components/img-fullscale/img-fullscale.component";
import { TranslateModule } from "@ngx-translate/core";
import { filter, Subscription, tap } from "rxjs";
import { HttpObservationService } from "../../shared/services/http-observation.service";
import { AuthService } from "../../shared/services/auth.service";
import { NewsItemWGP } from "../../api/models/news-response.interface";
import { NewsAPIService } from "../../api/services/news.api.service";
import { environment } from "../../../environments/environment";
import { LoadingAnimationComponent } from "../../common/components/animation/loading/loading-animation.component";
import { CacheCheckPipe } from "../../common/pipes/cache-check.pipe";
import { ImgPreloadService } from "../../shared/services/img-preload.service";
import { ArtGenre } from "../../shared/enums/art-genre.enum";

@Component({
    selector: 'app-archive',
    templateUrl: './archive.component.html',
    styleUrl: './archive.component.scss',
    imports: [
        CacheCheckPipe,
        CommonModule,
        DateFormatPipe,
        ImgFullscaleComponent,
        LoadingAnimationComponent,
        TranslateModule
    ],
    providers: [CacheCheckPipe]
})
export class ArchiveComponent implements OnInit, OnDestroy {

    protected newsCollection: NewsItemWGP[]
    protected isFullscale: boolean;
    protected currentPath?: string;
    protected isLoadingResponse: boolean;
    protected storageDomain: string;
    protected activeEntry: NewsItemWGP;

    private subscriptionHttpObservationFindAll$: Subscription;
    private subscriptionHttpObservationError$: Subscription;
    private delay: any;

    constructor(
        private readonly auth: AuthService,
        private readonly newsApi: NewsAPIService,
        private readonly imgPreload: ImgPreloadService,
        private readonly cacheCheckPipe: CacheCheckPipe,
        private readonly httpObservation: HttpObservationService
    ) {
        this.newsCollection = [];
        this.isFullscale = false;
        this.currentPath = '';
        this.isLoadingResponse = false;
        this.storageDomain = environment.STORAGE_URL;
        this.activeEntry = {
            news_id: '',
            gallery: '',
            title: '',
            content: '',
            edited: true,
            created_on: '',
            last_modified: '',
            image_path_gallery: '',
            thumbnail_path_gallery: '',
            reference_nr_gallery: '',
            art_genre_gallery: ArtGenre.ABSTRACT
        }

        this.subscriptionHttpObservationFindAll$ = new Subscription();
        this.subscriptionHttpObservationError$ = new Subscription();
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    ngOnInit() {
        this.subscriptionHttpObservationFindAll$ = this.httpObservation.newsFindAllWithGalleryPathsStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.httpObservation.setGalleryFindAllStatus(false);
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

    navigateFullscale(flag: boolean, entry?: NewsItemWGP) {
        this.isFullscale = flag;
        if(entry) {
            this.activeEntry = entry;
            this.currentPath = entry?.gallery !== null ? entry?.image_path_gallery : entry?.image_path;
        } else {
            this.currentPath = this.currentPath;
        }
    }

    loadNewsList() {
        this.isLoadingResponse = true;
        this.newsApi.sendGetAllWithGalleryPathsRequest().subscribe(data => {
            this.newsCollection = data.body?.body.data ?? [];
            const imgPathList: string[] = [];
            Object.values(this.newsCollection).forEach((value) => {
                const path = value.gallery !== null 
                        ? value.image_path_gallery
                        : value.image_path
                imgPathList.push(
                    this.cacheCheckPipe.transform(`${this.storageDomain}/${path}`, value.last_modified)
                );
            })
        })
    }

    ngOnDestroy() {
        this.subscriptionHttpObservationFindAll$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}