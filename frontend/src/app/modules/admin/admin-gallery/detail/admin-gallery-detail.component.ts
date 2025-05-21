import { AfterViewInit, Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CRUDMode } from "../../../../shared/enums/crud-mode.enum";
import { Router } from "@angular/router";
import { filter, tap } from "rxjs";
import { DataShareService } from "../../../../shared/services/data-share.service";
import { NavigationService } from "../../../../shared/services/navigation.service";
import { GalleryAPIService } from "../../../../api/services/gallery.api.service";
import { ArtTechnique } from "../../../../shared/enums/art-technique.enum";
import { ArtMedium } from "../../../../shared/enums/art-medium.enum";
import { GalleryItem } from "../../../../api/models/gallery-response.interface";
import * as EnumValidators from "../../../../common/helper/enum-converter";
import { ArtGenre } from "../../../../shared/enums/art-genre.enum";
import { HttpObservationService } from "../../../../shared/services/http-observation.service";
import { DateTimeService } from "../../../../shared/services/datetime.service";
import { AuthService } from "../../../../shared/services/auth.service";
import { AdminRoute } from "../../../../api/routes/admin.route.enum";
import { StorageRoute } from "../../../../api/routes/storage.route.enum";
import * as CustomValidator from '../../../../common/helper/custom-validators';
import { SaleStatus } from '../../../../shared/enums/sale-status.enum';
import { AdminDetailImportsModule } from '../../../../common/helper/admin-detail.imports.helper';
import { AbstractAdminDetailComponent } from '../../../../common/components/abstracts/admin-detail.abstract.component';
import { TextInputComponent } from "../../../../common/components/form-components/text-input/text-input.component";
import { SelectInputComponent } from "../../../../common/components/form-components/select-input/select-input.component";
import { CacheCheckPipe } from "../../../../common/pipes/cache-check.pipe";

@Component({
    selector: 'app-admin-gallery-detail',
    templateUrl: './admin-gallery-detail.component.html',
    styleUrl: '../../admin.component.scss',
    imports: [
        TextInputComponent,
        SelectInputComponent,
        ...AdminDetailImportsModule
    ],
    providers: [CacheCheckPipe]
})
export class AdminGalleryDetailComponent extends AbstractAdminDetailComponent implements OnInit, AfterViewInit {

    protected artworkForm: FormGroup;
    protected SaleStatusOptionEnum = SaleStatus;
    protected GenreOptionEnum = ArtGenre;
    protected MediumOptionEnum = ArtMedium;
    protected TechniqueOptionEnum = ArtTechnique
    protected artworkEntry: GalleryItem | null;
    protected hasGenre: boolean;

    constructor(
        router: Router,
        fb: FormBuilder,
        auth: AuthService,
        datetime: DateTimeService,
        navigate: NavigationService,
        dataSharing: DataShareService,
        httpObservation: HttpObservationService,
        protected galleryApi: GalleryAPIService
    ) {
        super(router, fb, auth, datetime, navigate, dataSharing, httpObservation);
        this.artworkForm = new FormGroup({});
        this.artworkEntry = null;        
        this.hasGenre = false;
    }

    ngOnInit() {
        this.navigate2DashboardOnRefresh(AdminRoute.GALLERY);
        this.subscriptionDataSharing$ = this.dataSharing.sharedData$.pipe(
            filter((x) => !!x),
            tap(async (data) => {
                this.mode = data.mode;
                this.entryId = data.entryId ?? '';
                if(this.mode === CRUDMode.UPDATE && this.entryId !== '') {
                    this.galleryApi.setIdParam(this.entryId);
                    this.galleryApi.sendGetOneRequest().subscribe(async data => {
                        (this.artworkEntry as any) = data.body?.body.data;
                        Object.assign((this.artworkEntry as any), {imageFile: data.body?.body.data.reference_nr});
                        this.hasGenre = this.artworkEntry?.art_genre ? true : false;
                        this.lastModifiedDateTime = this.datetime.convertTimestamp(this.artworkEntry?.last_modified ?? null);
                        this.initEdit();
                        this.pathFromExistingImg = this.configPathFromExistingEntry(
                            this.artworkEntry?.last_modified ?? '',
                            this.artworkEntry?.thumbnail_path
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
        this.subscriptionHttpObservationCreate$ = this.httpObservation.galleryCreateStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.httpObservation.setGalleryCreateStatus(false);
                    this.isLoadingResponse = false;
                    this.navigateToListView(AdminRoute.GALLERY);
                }
            })
        ).subscribe();

        this.subscriptionHttpObservationUpdate$ = this.httpObservation.galleryUpdateStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.httpObservation.setGalleryUpdateStatus(false);
                    this.isLoadingResponse = false;
                    this.navigateToListView(AdminRoute.GALLERY);
                }
            })
        ).subscribe();
    }

    private initForm() {
        this.artworkForm = this.fb.group({
            id: new FormControl(null),
            referenceNr: new FormControl(null),
            artGenre: new FormControl('', Validators.required),
            imageFile: new FormControl(null, Validators.required),
            imagePath: new FormControl(''),
            thumbnailPath: new FormControl(''),
            title: new FormControl(null),
            saleStatus: new FormControl('', Validators.required),
            price: new FormControl(null),
            dimensions: new FormControl('', Validators.required),
            artMedium: new FormControl('', Validators.required),
            artTechnique: new FormControl('', Validators.required),
            publication: new FormControl('', [Validators.required, CustomValidator.invalidPublicationValidator()]),
        })
    }

    private initEdit() {
        this.initForm();
        this.artworkForm.patchValue({
            id: this.artworkEntry?.gallery_id ?? null,
            referenceNr: this.artworkEntry?.reference_nr ?? null,
            artGenre: EnumValidators.isArtGenre(this.artworkEntry?.art_genre) ?? '',
            imageFile: (this.artworkEntry as any)?.imageFile ?? null,
            imagePath: this.artworkEntry?.image_path ?? '',
            thumbnailPath: this.artworkEntry?.thumbnail_path ?? '',
            title: this.artworkEntry?.title ?? null,
            saleStatus: EnumValidators.isSaleStatus(this.artworkEntry?.sale_status) ?? '',
            price: this.artworkEntry?.price ?? null,
            dimensions: this.artworkEntry?.dimensions ?? '',
            artMedium: EnumValidators.isArtMedium(this.artworkEntry?.art_medium) ?? ArtMedium.CANVAS,
            artTechnique: EnumValidators.isArtTechnique(this.artworkEntry?.art_technique) ?? ArtTechnique.ACRYLIC,
            publication: this.artworkEntry?.publication_year ?? '',
        })
    }

    readFileUpload(event: any) {
        this.pathFromExistingImg = null;
        this.artworkForm.get('imageFile')?.setValue(event);
        this.configPathByData(this.artworkForm.get('referenceNr')?.value);
    }

    readRemovalInfo(event: any) {
        if(event && !event.existingImgPath) {
            this.pathFromExistingImg = null;
            this.artworkForm.get('imageFile')?.setValue(null);
        }
    }

    getPublicationYearPlaceholder(): string {
        return (new Date().getFullYear()).toString();
    }

    onGenreChange(event: any) {
        if(Object.values(ArtGenre).includes(event.target?.value)) {
            this.hasGenre = true;
            this.isLoadingResponse = true;
            this.galleryApi.sendRefNrPreviewRequest(event.target?.value).subscribe((response) => {
                const refNr = response.body?.body.referenceNr ?? null;
                this.artworkForm.get('referenceNr')?.setValue(refNr);
                this.configPathByData(refNr);
                this.isLoadingResponse = false;
            });
        }
    }

    configPathByData(refNr: string | null) {
        if(!refNr) {
            return;
        }
        this.artworkForm.get('imagePath')?.setValue(`${StorageRoute.ART_ORIGINAL}/${refNr}.webp`);
        this.artworkForm.get('thumbnailPath')?.setValue(`${StorageRoute.ART_RESIZED}/${refNr}.webp`);
    }
}