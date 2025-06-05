import { AssetsAPIService } from './../../../api/services/assets.api.service';
import { AfterViewInit, Component, inject, OnDestroy } from "@angular/core";
import { filter, Subject, Subscription, tap } from "rxjs";
import { CRUDMode } from "../../../shared/enums/crud-mode.enum";
import { Router } from "@angular/router";
import { NavigationService } from "../../../shared/services/navigation.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { AuthService } from "../../../shared/services/auth.service";
import { DateTimeService } from "../../../shared/services/datetime.service";
import { DataShareService } from "../../../shared/services/data-share.service";
import { HttpObservationService } from "../../../shared/services/http-observation.service";
import { AdminRoute } from "../../../api/routes/admin.route.enum";
import { environment } from "../../../../environments/environment";
import { BaseRoute } from "../../../api/routes/base.route.enum";
import { NewsAPIService } from "../../../api/services/news.api.service";
import { GalleryAPIService } from "../../../api/services/gallery.api.service";
import { CacheCheckPipe } from "../../pipes/cache-check.pipe";

@Component({
    template: '',
    providers: [CacheCheckPipe]
})
export abstract class AbstractAdminDetailComponent implements AfterViewInit, OnDestroy{

    protected mode: CRUDMode;
    protected ModeOptionEnum = CRUDMode;
    protected AdminRouteEnum = AdminRoute;
    protected isLoadingResponse: boolean;
    protected isLoadingInit: boolean;
    protected lastModifiedDateTime: string;
    protected pathFromExistingImg: string | null;
    protected onSubmitTrigger: Subject<boolean>;

    protected subscriptionDataSharing$: Subscription;
    protected subscriptionHttpObservationCreate$: Subscription;
    protected subscriptionHttpObservationUpdate$: Subscription;
    protected subscriptionHttpObservationError$: Subscription;
    protected entryId: string;
    protected delay: any;

    private cacheCheck: any;

    constructor(
        protected router: Router,
        protected fb: FormBuilder,
        protected auth: AuthService,
        protected datetime: DateTimeService,
        protected navigate: NavigationService,
        protected dataSharing: DataShareService,
        protected httpObservation: HttpObservationService
    ) {
        this.cacheCheck = inject(CacheCheckPipe);
        this.mode = CRUDMode.UPDATE;
        this.isLoadingResponse = true;
        this.isLoadingInit = true;
        this.lastModifiedDateTime = '';
        this.pathFromExistingImg = null;
        this.onSubmitTrigger = new Subject<boolean>();
        
        this.subscriptionDataSharing$ = new Subscription();
        this.subscriptionHttpObservationCreate$ = new Subscription();
        this.subscriptionHttpObservationUpdate$ = new Subscription();
        this.subscriptionHttpObservationError$ = new Subscription();
        this.entryId = '';
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    // ABSTRACTS
    abstract readFileUpload(event: any): void;

    abstract readRemovalInfo(event: any): void;

    abstract configPathByData(data: string | null): void;

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

    configPathFromExistingEntry(lastModified: string, dbPath?: string): string | null {
        const storageDomain = this.mode === CRUDMode.CREATE ? `${environment.STORAGE_URL}/` : '';
        return dbPath ? this.cacheCheck.transform(`${storageDomain}${dbPath}`, lastModified) : null;
    }

    onSubmit(formGroup: FormGroup, api: AssetsAPIService | GalleryAPIService | NewsAPIService) {
        formGroup.markAllAsTouched();
        this.onSubmitTrigger.next(formGroup.get('imageFile')?.value !== null);
        if(formGroup.invalid) {
            return;
        }

        this.isLoadingResponse = true;
        if(this.mode === CRUDMode.CREATE) {
            api.setCreatePayload(formGroup.getRawValue());
            api.sendCreateRequest().subscribe();
        } else if(this.mode === CRUDMode.UPDATE) {
            api.setUpdatePayload(formGroup.getRawValue());
            api.sendUpdateRequest().subscribe();
        }
    }

    async cancel(route: AdminRoute) {
        this.isLoadingResponse = true;
        await this.delay(500); // UX purpose
        this.isLoadingResponse = false;
        this.navigateToListView(route);
    }

    remove(route: AdminRoute, api: AssetsAPIService | GalleryAPIService | NewsAPIService) {
        if(this.mode === CRUDMode.UPDATE && this.entryId !== '') {
            this.isLoadingResponse = true;
            api.setIdParam(this.entryId);
            api.sendDeleteRequest().subscribe(async (response) => {
                await this.delay(500);
                if(response.body?.body.deleted) {
                    this.navigateToListView(route);
                }
                this.isLoadingResponse = false;
            });
        }
    }

    navigateToListView(route: AdminRoute) {
        this.router.navigate([`${BaseRoute.ADMIN}${route}`]);
    }

    navigate2DashboardOnRefresh(route: AdminRoute) {
        // do not remain in component after page refresh
        if(this.navigate.getPreviousUrl() === 'UNAVAILABLE') {
            this.router.navigate([`admin${route}`]);
        }
    }

    ngOnDestroy() {
        this.subscriptionDataSharing$.unsubscribe();
        this.subscriptionHttpObservationCreate$.unsubscribe();
        this.subscriptionHttpObservationUpdate$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}