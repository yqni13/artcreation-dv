import { environment } from './../../../../environments/environment';
import { GalleryRoute } from './../../../api/routes/gallery.route.enum';
import { BaseRoute } from './../../../api/routes/base.route.enum';
import { CRUDMode } from './../../../shared/enums/crud-mode.enum';
import { AfterViewInit, Component, inject, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { filter, Subscription, tap } from "rxjs";
import { HttpObservationService } from '../../../shared/services/http-observation.service';
import { AuthService } from '../../../shared/services/auth.service';
import { DataShareService } from '../../../shared/services/data-share.service';
import { Router } from '@angular/router';
import { AdminRoute } from '../../../api/routes/admin.route.enum';
import { NewsRoute } from '../../../api/routes/news.route.enum';
import { AssetsRoute } from '../../../api/routes/assets.route.enum';

@Component({
    template: '',
    host: {
        '(document:keydown)': 'navigateSearchByKey($event)'
    }
})
export abstract class AbstractAdminListComponent implements AfterViewInit, OnDestroy {

    protected router = inject(Router);
    protected fb = inject(FormBuilder);
    protected auth = inject(AuthService);
    protected dataSharing = inject(DataShareService);
    protected httpObservation = inject(HttpObservationService);

    protected searchForm: FormGroup = new FormGroup({});
    protected hasSearchText = false;
    protected isLoadingResponse = false;
    protected storageDomain = environment.STORAGE_URL.trim();
    protected AdminRouteEnum = AdminRoute;
    protected AssetsRouteEnum = AssetsRoute;
    protected GalleryRouteEnum = GalleryRoute;
    protected NewsRouteEnum = NewsRoute;

    protected subscriptionHttpObservationFindAll$ = new Subscription();
    private subscriptionHttpObservationError$ = new Subscription();
    private delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // ABSTRACTS
    abstract onSearchSubmit(initial: boolean): void;

    abstract filterListBySearchText(searchText: string): void;

    abstract navigateToUpdateItem(id: string): void;

    // METHODS
    ngAfterViewInit() {
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
    }

    onSearchTextChange(event: string) {
        this.hasSearchText = event !== '' ? true : false;
        this.onSearchSubmit(false);
    }

    removeSearchText() {
        this.searchForm.get('searchText')?.setValue('');
        this.hasSearchText = false;
        this.onSearchSubmit(false);
    }

    navigateSearchByKey(event: KeyboardEvent) {
        if(event.key === 'Enter') {
            this.onSearchSubmit(false);
        } else if(event.key === 'Escape') {
            this.hasSearchText = false;
            this.searchForm.get('searchText')?.setValue('');
            this.onSearchSubmit(false);
        }
    }

    navigateToCreateItem(adminRoute: AdminRoute, specificRoute: GalleryRoute | NewsRoute) {
        const data = { mode: CRUDMode.CREATE };
        this.dataSharing.setSharedData(data);
        this.router.navigate([`${BaseRoute.ADMIN}${adminRoute}/${specificRoute}`]);
    }

    navigateToDashboard() {
        this.router.navigate([BaseRoute.ADMIN]);
    }

    ngOnDestroy() {
        this.subscriptionHttpObservationFindAll$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}