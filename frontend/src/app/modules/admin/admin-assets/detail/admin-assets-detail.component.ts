import { AfterViewInit, Component, inject, OnInit } from "@angular/core";
import { AdminDetailImportsModule } from "../../../../common/helper/admin-detail.imports.helper";
import { SelectInputComponent } from "../../../../common/components/form-components/select-input/select-input.component";
import { TextInputComponent } from "../../../../common/components/form-components/text-input/text-input.component";
import { AbstractAdminDetailComponent } from "../../../../common/components/abstracts/admin-detail.abstract.component";
import { HttpObservationService } from "../../../../shared/services/http-observation.service";
import { DataShareService } from "../../../../shared/services/data-share.service";
import { NavigationService } from "../../../../shared/services/navigation.service";
import { DateTimeService } from "../../../../shared/services/datetime.service";
import { AuthService } from "../../../../shared/services/auth.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AdminRoute } from "../../../../api/routes/admin.route.enum";
import { filter, tap } from "rxjs";
import { AssetsCategory } from "../../../../shared/enums/assets-category.enum";
import { AssetsItem } from "../../../../api/models/assets.response.interface";
import { CRUDMode } from "../../../../shared/enums/crud-mode.enum";
import { AssetsAPIService } from "../../../../api/services/assets.api.service";
import { StorageRoute } from "../../../../api/routes/storage.route.enum";
import { CacheCheckPipe } from "../../../../common/pipes/cache-check.pipe";
import { DateTimePickerPipe } from "../../../../common/pipes/datetime-picker.pipe";

@Component({
    selector: 'app-admin-assets-detail',
    templateUrl: './admin-assets-detail.component.html',
    styleUrl: '../../admin.component.scss',
    imports: [
        TextInputComponent,
        SelectInputComponent,
        ...AdminDetailImportsModule
    ],
    providers: [
        CacheCheckPipe,
        DateTimePickerPipe
    ]
})
export class AdminAssetsDetailComponent extends AbstractAdminDetailComponent implements OnInit, AfterViewInit {
    
    protected assetsForm: FormGroup;
    protected AssetsCategoryEnum = AssetsCategory;
    protected assetsEntry: AssetsItem | null;
    protected hasCategory: boolean;
    
    constructor(
        router: Router,
        fb: FormBuilder,
        auth: AuthService,
        datetime: DateTimeService,
        navigate: NavigationService,
        dataSharing: DataShareService,
        httpObservation: HttpObservationService,
        protected assetsApi: AssetsAPIService,
        private readonly dtPicker: DateTimePickerPipe
    ) {
        super(router, fb, auth, datetime, navigate, dataSharing, httpObservation);
        this.assetsForm = new FormGroup({});
        this.assetsEntry = null;
        this.hasCategory = false;
    }

    ngOnInit() {
        this.navigate2DashboardOnRefresh(AdminRoute.ASSETS);
        this.subscriptionDataSharing$ = this.dataSharing.sharedData$.pipe(
            filter((x) => !!x),
            tap(async (data) => {
                this.mode = data.mode;
                this.entryId = data.entryId ?? '';
                if(this.mode === CRUDMode.UPDATE && this.entryId !== '') {
                    this.assetsApi.setIdParam(this.entryId);
                    this.assetsApi.sendGetOneRequest().subscribe(async data => {
                        (this.assetsEntry as any) = data.body?.body.data;
                        Object.assign((this.assetsEntry as any), {imageFile: data.body?.body.data.assets_id});
                        this.hasCategory = this.assetsEntry?.category ? true : false;
                        this.lastModifiedDateTime = this.datetime.convertTimestamp(this.assetsEntry?.last_modified ?? null);
                        this.initEdit();
                        this.pathFromExistingImg = this.configPathFromExistingEntry(
                            this.assetsEntry?.last_modified ?? '',
                            this.assetsEntry?.thumbnail_path
                        );
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
        this.subscriptionHttpObservationCreate$ = this.httpObservation.assetsCreateStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.httpObservation.setAssetsCreateStatus(false);
                    this.isLoadingResponse = false;
                    this.navigateToListView(AdminRoute.ASSETS);
                }
            })
        ).subscribe();

        this.subscriptionHttpObservationUpdate$ = this.httpObservation.assetsUpdateStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.httpObservation.setAssetsUpdateStatus(false);
                    this.isLoadingResponse = false;
                    this.navigateToListView(AdminRoute.ASSETS);
                }
            })
        ).subscribe();
    }

    private initForm() {
        this.assetsForm = this.fb.group({
            id: new FormControl(null),
            category: new FormControl(null, Validators.required),
            imageFile: new FormControl(null, Validators.required),
            imagePath: new FormControl(''),
            thumbnailPath: new FormControl(''),
            location: new FormControl(null),
            datetime: new FormControl('', Validators.required),
        })
    }

    private initEdit() {
        this.initForm();
        this.assetsForm.patchValue({
            id: this.assetsEntry?.assets_id ?? null,
            category: this.assetsEntry?.category ?? '',
            imageFile: (this.assetsEntry as any)?.imageFile ?? null,
            imagePath: this.assetsEntry?.image_path ?? null,
            thumbnailPath: this.assetsEntry?.thumbnail_path ?? null,
            location: this.assetsEntry?.location ?? null,
            datetime: this.dtPicker.transform(this.assetsEntry?.datetime ?? ''),
        })
    }

    readFileUpload(event: any) {
        this.pathFromExistingImg = null;
        this.assetsForm.get('imageFile')?.setValue(event);
        this.configPathByData('placeholder');
    }

    readRemovalInfo(event: any) {
        if(event && !event.existingImgPath) {
            this.pathFromExistingImg = null;
            this.assetsForm.get('imageFile')?.setValue(null);
        }
    }

    onCategoryChange(event: any) {
        if(Object.values(AssetsCategory).includes(event.target?.value)) {
            this.hasCategory = true;
            this.assetsForm.get('category')?.setValue(event.target?.value);
        }
    }

    configPathByData(data: string | null) {
        if(!data) {
            return;
        }
        this.assetsForm.get('imagePath')?.setValue(`${StorageRoute.ASSETS_ORIGINAL}/${data}.webp`);
        this.assetsForm.get('thumbnailPath')?.setValue(`${StorageRoute.ASSETS_RESIZED}/${data}.webp`);
    }
}