import { environment } from './../../../../environments/environment';
import { GalleryRoute } from './../../../api/routes/gallery.route.enum';
import { BaseRoute } from './../../../api/routes/base.route.enum';
import { CRUDMode } from './../../../shared/enums/crud-mode.enum';
import { AfterViewInit, Component, HostListener, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { filter, Subscription, tap } from "rxjs";
import { HttpObservationService } from '../../../shared/services/http-observation.service';
import { AuthService } from '../../../shared/services/auth.service';
import { DataShareService } from '../../../shared/services/data-share.service';
import { Router } from '@angular/router';
import { AdminRoute } from '../../../api/routes/admin.route.enum';
import { NewsRoute } from '../../../api/routes/news.route.enum';

@Component({
    template: ''
})
export abstract class AbstractAdminListComponent implements AfterViewInit, OnDestroy {

    @HostListener('window:keydown', ['$event'])
    navigateSearchByKey(event: KeyboardEvent) {
        if(event.key === 'Enter') {
            this.onSearchSubmit(false);
        } else if(event.key === 'Escape') {
            this.hasSearchText = false;
            this.searchForm.get('searchText')?.setValue('');
            this.onSearchSubmit(false);
        }
    }

    protected searchForm: FormGroup;
    protected hasSearchText: boolean;
    protected isLoadingResponse: boolean;
    protected storageDomain: string;
    protected AdminRouteEnum = AdminRoute;
    protected GalleryRouteEnum = GalleryRoute;
    protected NewsRouteEnum = NewsRoute;

    protected subscriptionHttpObservationFindAll$: Subscription;
    private subscriptionHttpObservationError$: Subscription;
    private delay: any;

    constructor(
        protected router: Router,
        protected fb: FormBuilder,
        protected auth: AuthService,
        protected dataSharing: DataShareService,
        protected httpObservation: HttpObservationService
    ) {
        this.searchForm = new FormGroup({});
        this.hasSearchText = false;
        this.isLoadingResponse = false;
        this.storageDomain = environment.STORAGE_URL;

        this.subscriptionHttpObservationFindAll$ = new Subscription();
        this.subscriptionHttpObservationError$ = new Subscription();
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    // ABSTRACTS
    abstract onSearchSubmit(initial: boolean): void;

    abstract filterListBySearchText(searchText: string): void;

    abstract navigateToUpdateItem(id: string): void;

    // METHODS
    ngAfterViewInit() {
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
    }

    onSearchTextChange(event: string) {
        this.hasSearchText = event !== '' ? true : false;
    }

    removeSearchText() {
        this.searchForm.get('searchText')?.setValue('');
        this.hasSearchText = false;
        this.onSearchSubmit(false);
    }

    navigateToCreateItem(adminRoute: AdminRoute, specificRoute: GalleryRoute | NewsRoute) {
        const data = {
            mode: CRUDMode.CREATE
        }
        this.dataSharing.setSharedData(data);
        this.router.navigate([`${BaseRoute.ADMIN}${adminRoute}/${specificRoute}`]);
    }

    navigateToDashboard() {
        this.router.navigate([BaseRoute.ADMIN]);
    }

    updateCachedPath(timestamp: string): string {
        const alteredPath = new Date(timestamp).getTime();
        return `?v=${alteredPath}`;
    }

    ngOnDestroy() {
        this.subscriptionHttpObservationFindAll$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}