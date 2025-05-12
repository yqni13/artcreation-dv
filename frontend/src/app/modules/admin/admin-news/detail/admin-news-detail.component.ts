import { AfterViewInit, Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NewsItem } from "../../../../api/models/news-response.interface";
import { AbstractAdminDetailComponent } from "../../../../common/components/abstracts/admin-detail.abstract.component";
import { Router } from "@angular/router";
import { AuthService } from "../../../../shared/services/auth.service";
import { DateTimeService } from "../../../../shared/services/datetime.service";
import { NavigationService } from "../../../../shared/services/navigation.service";
import { DataShareService } from "../../../../shared/services/data-share.service";
import { HttpObservationService } from "../../../../shared/services/http-observation.service";
import { NewsAPIService } from "../../../../api/services/news.api.service";
import { filter, tap } from "rxjs";
import { AdminRoute } from "../../../../api/routes/admin.route.enum";
import { CRUDMode } from "../../../../shared/enums/crud-mode.enum";
import { StorageRoute } from "../../../../api/routes/storage.route.enum";
import { AdminDetailImportsModule } from "../../../../common/helper/admin-detail.imports.helper";
import { TextareaInputComponent } from "../../../../common/components/form-components/textarea-input/textarea-input.component";

@Component({
    selector: 'app-admin-news-detail',
    templateUrl: './admin-news-detail.component.html',
    styleUrl: '../../admin.component.scss',
    imports: [
        TextareaInputComponent,
    ...AdminDetailImportsModule
]
})

export class AdminNewsDetailComponent extends AbstractAdminDetailComponent implements OnInit, AfterViewInit {

    protected newsForm: FormGroup;
    protected newsEntry: NewsItem | null;

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
                    this.newsApi.sendGetOneRequest().subscribe(async data => {
                        (this.newsEntry as any) = data.body?.body.data;
                        // Object.assign((this.newsEntry as any), {imageFile: data.body?.body.data.reference_nr});
                        this.lastModifiedDateTime = this.datetime.convertTimestamp(this.newsEntry?.last_modified ?? null);
                        this.initEdit();
                        this.pathFromExistingImg = this.configPathFromExistingImg(this.newsEntry?.thumbnail_path);
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
    }

    private initForm() {
        this.newsForm = this.fb.group({
            news_id: new FormControl(null),
            gallery_id: new FormControl(null),
            imageFile: new FormControl(null, Validators.required),
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
            gallery_id: this.newsEntry?.gallery_id ?? null,
            imageFile: (this.newsEntry as any)?.imageFile ?? null,
            imagePath: this.newsEntry?.image_path ?? '',
            thumbnailPath: this.newsEntry?.thumbnail_path ?? '',
            title: this.newsEntry?.title ?? '',
            content: this.newsEntry?.content ?? ''
        })
    }

    readFileUpload(event: any) {
        this.pathFromExistingImg = null;
        this.newsForm.get('imageFile')?.setValue(event);
        this.configPathByData(this.newsForm.get('??')?.value); // TODO(yqni13): which reference?
    }

    readRemovalInfo(event: any) {
        if(event && !event.existingImgPath) {
            this.pathFromExistingImg = null;
            this.newsForm.get('imageFile')?.setValue(null);
        }
    }

    configPathByData(data: string | null) {
        if(!data) {
            return;
        }
        this.newsForm.get('imagePath')?.setValue(`${StorageRoute.ART_ORIGINAL}/${data}.webp`);
        this.newsForm.get('thumbnailPath')?.setValue(`${StorageRoute.ART_RESIZED}/${data}.webp`);
    }
}