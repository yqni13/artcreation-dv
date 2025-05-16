import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NewsItemWGP } from "../../../../api/models/news-response.interface";
import { AbstractAdminDetailComponent } from "../../../../common/components/abstracts/admin-detail.abstract.component";
import { Router } from "@angular/router";
import { AuthService } from "../../../../shared/services/auth.service";
import { DateTimeService } from "../../../../shared/services/datetime.service";
import { NavigationService } from "../../../../shared/services/navigation.service";
import { DataShareService } from "../../../../shared/services/data-share.service";
import { HttpObservationService } from "../../../../shared/services/http-observation.service";
import { NewsAPIService } from "../../../../api/services/news.api.service";
import { filter, Subscription, tap } from "rxjs";
import { AdminRoute } from "../../../../api/routes/admin.route.enum";
import { CRUDMode } from "../../../../shared/enums/crud-mode.enum";
import { StorageRoute } from "../../../../api/routes/storage.route.enum";
import { AdminDetailImportsModule } from "../../../../common/helper/admin-detail.imports.helper";
import { TextareaInputComponent } from "../../../../common/components/form-components/textarea-input/textarea-input.component";
import { SelectInputComponent } from "../../../../common/components/form-components/select-input/select-input.component";
import { SourceOption } from "../../../../shared/enums/source-option.enum";
import { GalleryItem } from "../../../../api/models/gallery-response.interface";
import { SelectGalleryItemComponent } from "../../../../common/components/select-galleryitem/select-galleryitem.component";

@Component({
    selector: 'app-admin-news-detail',
    templateUrl: './admin-news-detail.component.html',
    styleUrl: '../../admin.component.scss',
    imports: [
        SelectGalleryItemComponent,
        SelectInputComponent,
        TextareaInputComponent,
    ...AdminDetailImportsModule
]
})
export class AdminNewsDetailComponent extends AbstractAdminDetailComponent implements OnInit, AfterViewInit, OnDestroy {

    protected newsForm: FormGroup;
    protected newsEntry: NewsItemWGP | null;
    protected SourceOptionEnum = SourceOption;
    protected CRUDModeEnum = CRUDMode;
    protected galleryList: GalleryItem[];
    protected hasSourceOption: boolean;

    private subscriptionHttpObservationFindOne$: Subscription;

    constructor(
        router: Router,
        fb: FormBuilder,
        auth: AuthService,
        datetime: DateTimeService,
        navigate: NavigationService,
        dataSharing: DataShareService,
        httpObservation: HttpObservationService,
        protected newsApi: NewsAPIService
    ) {
        super(router, fb, auth, datetime, navigate, dataSharing, httpObservation);
        this.newsForm = new FormGroup({});
        this.newsEntry = null;
        this.galleryList = [];
        this.hasSourceOption = false;

        this.subscriptionHttpObservationFindOne$ = new Subscription();
    }

    ngOnInit() {
        this.navigate2DashboardOnRefresh(AdminRoute.NEWS);

        this.subscriptionDataSharing$ = this.dataSharing.sharedData$.pipe(
            filter((x) => !!x),
            tap(async (data) => {
                this.mode = data.mode;
                this.entryId = data.entryId ?? '';
                if(this.mode === CRUDMode.UPDATE && this.entryId !== '') {
                    this.newsApi.setIdParam(this.entryId);
                    this.newsApi.sendGetOneWithGalleryPathsRequest().subscribe(async data => {
                        (this.newsEntry as any) = data.body?.body.data;
                        this.pathFromExistingImg = data.body?.body.data.gallery === null 
                            ? this.configPathFromExistingImg(this.newsEntry?.thumbnail_path)
                            : !this.newsEntry?.thumbnail_path_gallery
                                ? null 
                                : this.newsEntry?.thumbnail_path_gallery;
                        if(data.body?.body.data.image_path) {
                            Object.assign((this.newsEntry as any), {imageFile: data.body?.body.data.news_id});
                        }
                        this.lastModifiedDateTime = this.datetime.convertTimestamp(this.newsEntry?.last_modified ?? null);
                        this.initEdit();
                        await this.delay(500);
                        this.isLoadingInit = false;
                        this.isLoadingResponse = false;
                    })
                } else {
                    await this.delay(500);
                    this.isLoadingInit = false;
                    this.isLoadingResponse = false;
                    this.initEdit();
                }
            })
        ).subscribe();
    }

    override ngAfterViewInit() {
        super.ngAfterViewInit();
        this.subscriptionHttpObservationCreate$ = this.httpObservation.newsCreateStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.httpObservation.setNewsCreateStatus(false);
                    this.isLoadingResponse = false;
                    this.navigateToListView(AdminRoute.NEWS);
                }
            })
        ).subscribe();

        this.subscriptionHttpObservationUpdate$ = this.httpObservation.newsUpdateStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.httpObservation.setNewsUpdateStatus(false);
                    this.isLoadingResponse = false;
                    this.navigateToListView(AdminRoute.NEWS);
                }
            })
        ).subscribe();

        this.subscriptionHttpObservationFindOne$ = this.httpObservation.newsFindOneWithGalleryPathsStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.httpObservation.setNewsFindOneWithGalleryPathsStatus(false);
                    this.isLoadingResponse = false;
                }
            })
        ).subscribe();
    }

    private initForm() {
        this.newsForm = this.fb.group({
            news_id: new FormControl(null),
            source: new FormControl(null),
            gallery_id: new FormControl(null),
            imageFile: new FormControl(null), // only required if no gallery id linked
            imagePath: new FormControl(null),
            thumbnailPath: new FormControl(null),
            title: new FormControl(null, [Validators.required, Validators.maxLength(75)]),
            content: new FormControl(null, [Validators.required, Validators.maxLength(450)])
        })
    }


    private initEdit() {
        this.initForm();
        this.newsForm.patchValue({
            news_id: this.newsEntry?.news_id ?? null,
            source: '',
            gallery_id: this.newsEntry?.gallery ?? null,
            imageFile: (this.newsEntry as any)?.imageFile ?? null,
            imagePath: this.newsEntry?.image_path ?? null,
            thumbnailPath: this.newsEntry?.thumbnail_path ?? null,
            title: this.newsEntry?.title ?? null,
            content: this.newsEntry?.content ?? null
        })
    }

    readFileUpload(event: any) {
        this.pathFromExistingImg = null;
        this.newsForm.get('imageFile')?.setValue(event);
        this.configPathByData('placeholder');
    }

    readRemovalInfo(event: any) {
        if(event && !event.existingImgPath) {
            this.pathFromExistingImg = null;
            this.newsForm.get('imageFile')?.setValue(null);
            this.newsForm.get('imagePath')?.setValue(null);
            this.newsForm.get('thumbnailPath')?.setValue(null);
        }
    }

    onSourceChange(event: any) {
        const val = event.target?.value ?? null;
        if(val === SourceOption.NEW || val === SourceOption.EXIST) {
            this.hasSourceOption = true;
        }
    }

    onGalleryItemSelect(event: any) {
        if(typeof event === 'string') {
            this.newsForm.get('gallery_id')?.setValue(event);
            this.newsForm.get('imageFile')?.setValue(null);
            this.newsForm.get('imagePath')?.setValue(null);
            this.newsForm.get('thumbnailPath')?.setValue(null);
        } else if(event === null) {
            this.newsForm.get('gallery_id')?.setValue(null);
            this.pathFromExistingImg = null;
        }
    }

    override onSubmit() {
        this.newsForm.markAllAsTouched();
        if(this.newsForm.get('source')?.value === SourceOption.EXIST) {
            this.onSubmitTrigger.next(this.newsForm.get('gallery_id')?.value !== null);
        } else {
            this.onSubmitTrigger.next(this.newsForm.get('imagePath')?.value !== null);
        }

        if(this.newsForm.invalid) {
            return;
        }

        this.isLoadingResponse = true;
        if(this.mode === CRUDMode.CREATE) {
            this.newsApi.setCreatePayload(this.newsForm.getRawValue());
            this.newsApi.sendCreateRequest().subscribe();
        } else if(this.mode === CRUDMode.UPDATE) {
            this.newsApi.setUpdatePayload(this.newsForm.getRawValue());
            this.newsApi.sendUpdateRequest().subscribe();
        }
    }

    configPathByData(data: string | null) {
        if(!data) {
            return;
        }
        this.newsForm.get('imagePath')?.setValue(`${StorageRoute.NEWS_ORIGINAL}/${data}.webp`);
        this.newsForm.get('thumbnailPath')?.setValue(`${StorageRoute.NEWS_RESIZED}/${data}.webp`);
    }

    override ngOnDestroy() {
        super.ngOnDestroy();
        this.subscriptionHttpObservationFindOne$.unsubscribe();
    }
}