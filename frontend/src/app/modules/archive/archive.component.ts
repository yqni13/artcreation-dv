import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { DateFormatPipe } from "../../common/pipes/date-format.pipe";
import { ImgFullscaleComponent } from "../../common/components/img-fullscale/img-fullscale.component";
import { TranslateModule } from "@ngx-translate/core";
import { filter, Subscription, tap } from "rxjs";
import { HttpObservationService } from "../../shared/services/http-observation.service";
import { AuthService } from "../../shared/services/auth.service";
import { NewsItemWGP } from "../../api/interfaces/news-response.interface";
import { NewsAPIService } from "../../api/services/news.api.service";
import { environment } from "../../../environments/environment";
import { LoadingAnimationComponent } from "../../common/components/animation/loading/loading-animation.component";
import { CacheCheckPipe } from "../../common/pipes/cache-check.pipe";
import { ImgPreloadService } from "../../shared/services/img-preload.service";
import { ArtGenre } from "../../shared/enums/art-genre.enum";

@Component({
    selector: 'app-archive',
    imports: [
        CacheCheckPipe,
        CommonModule,
        DateFormatPipe,
        ImgFullscaleComponent,
        LoadingAnimationComponent,
        TranslateModule
    ],
    templateUrl: './archive.component.html',
    styleUrl: './archive.component.scss',
    providers: [CacheCheckPipe]
})
export class ArchiveComponent implements OnInit, OnDestroy {

    private readonly auth = inject(AuthService);
    private readonly newsApi = inject(NewsAPIService);
    private readonly imgPreload = inject(ImgPreloadService);
    private readonly cacheCheckPipe = inject(CacheCheckPipe);
    private readonly httpObservation = inject(HttpObservationService);

    protected newsCollection: NewsItemWGP[] = [];
    protected isFullscale = false;
    protected currentPath? = '';
    protected isLoadingResponse = false;
    protected storageDomain = environment.STORAGE_URL.trim();
    protected activeEntry: NewsItemWGP = this.initActiveEntry();

    private subscriptionHttpObservationFindAll$ = new Subscription();
    private subscriptionHttpObservationError$ = new Subscription();
    private delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    private initActiveEntry(): NewsItemWGP {
        return {
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
        };
    }

    navigateFullscale(flag: boolean, entry?: NewsItemWGP) {
        this.isFullscale = flag;
        if(entry) {
            this.activeEntry = entry;
            this.currentPath = entry?.gallery !== null ? entry?.image_path_gallery : entry?.image_path;
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
            this.imgPreload.preloadMultiple(imgPathList);
        })
    }

    ngOnDestroy() {
        this.subscriptionHttpObservationFindAll$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}