import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CRUDMode } from "../../../../shared/enums/crud-mode.enum";
import { Router } from "@angular/router";
import { filter, Subscription, tap } from "rxjs";
import { DataShareService } from "../../../../shared/services/data-share.service";
import { NavigationService } from "../../../../shared/services/navigation.service";
import { TranslateModule } from "@ngx-translate/core";
import { GalleryAPIService } from "../../../../api/services/gallery.api.service";
import { ArtTechnique } from "../../../../shared/enums/art-technique.enum";
import { ArtMedium } from "../../../../shared/enums/art-medium.enum";
import { GalleryItem } from "../../../../api/models/gallery-response.interface";
import { LoadingAnimationComponent } from "../../../../common/components/animation/loading/loading-animation.component";
import { SelectInputComponent } from "../../../../common/components/form-components/select-input/select-input.component";
import * as EnumValidators from "../../../../common/helper/enum-converter";
import { ArtGenre } from "../../../../shared/enums/art-genre.enum";
import { CastAbstractToFormControlPipe } from "../../../../common/pipes/cast-abstracttoform-control.pipe";
import { TextInputComponent } from "../../../../common/components/form-components/text-input/text-input.component";
import { HttpObservationService } from "../../../../shared/services/http-observation.service";
import { GalleryUpdateRequest } from "../../../../api/models/gallery-request.interface";
import { DateTimeService } from "../../../../shared/services/datetime.service";

@Component({
    selector: 'app-admin-gallery-detail',
    templateUrl: './admin-gallery-detail.component.html',
    styleUrl: './admin-gallery-detail.component.scss',
    imports: [
        CommonModule,
        CastAbstractToFormControlPipe,
        LoadingAnimationComponent,
        ReactiveFormsModule,
        SelectInputComponent,
        TextInputComponent,
        TranslateModule
    ]
})
export class AdminGalleryDetailComponent implements OnInit, AfterViewInit, OnDestroy{

    protected artworkForm: FormGroup;
    protected mode: CRUDMode;
    protected modeOptions = CRUDMode;
    protected genreOptions = ArtGenre;
    protected mediumOptions = ArtMedium;
    protected techniqueOptions = ArtTechnique
    protected artworkEntry: GalleryItem | null;
    protected isLoadingResponse: boolean;
    protected isLoadingInit: boolean;
    protected hasGenre: boolean;
    protected lastModified: string;

    private subscriptionDataSharing$: Subscription;
    private subscriptionHttpObservationCreate$: Subscription;
    private subscriptionHttpObservationUpdate$: Subscription;
    private subscriptionHttpObservationError$: Subscription;
    private entryId: string;
    private delay: any;

    constructor(
        private readonly router: Router,
        private readonly fb: FormBuilder,
        private readonly datetime: DateTimeService,
        private readonly navigate: NavigationService,
        private readonly galleryApi: GalleryAPIService,
        private readonly dataSharing: DataShareService,
        private readonly httpObservation: HttpObservationService
    ) {
        this.artworkForm = new FormGroup({});
        this.mode = CRUDMode.update;
        this.artworkEntry = null;
        this.isLoadingResponse = true;
        this.isLoadingInit = true;
        this.lastModified = '';
        
        this.subscriptionDataSharing$ = new Subscription();
        this.subscriptionHttpObservationCreate$ = new Subscription();
        this.subscriptionHttpObservationUpdate$ = new Subscription();
        this.subscriptionHttpObservationError$ = new Subscription();
        this.hasGenre = false;
        this.entryId = '';
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    ngOnInit() {
        // do not remain in component after page refresh
        if(this.navigate.getPreviousUrl() === 'UNAVAILABLE') {
            this.router.navigate(['admin/gallery']);
        }

        this.subscriptionDataSharing$ = this.dataSharing.sharedData$.pipe(
            filter((x) => !!x),
            tap(async (data) => {
                this.mode = data.mode;
                this.entryId = data.entryId ?? '';
                if(this.mode === CRUDMode.update && this.entryId !== '') {
                    this.galleryApi.setIdParam(this.entryId);
                    this.galleryApi.sendGetOneRequest().subscribe(async data => {
                        (this.artworkEntry as any) = data.body?.body.data;
                        this.hasGenre = this.artworkEntry?.art_genre ? true : false;
                        this.lastModified = this.datetime.convertTimestamp(this.artworkEntry?.last_modified ?? null);
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

    ngAfterViewInit() {
        this.subscriptionHttpObservationCreate$ = this.httpObservation.galleryCreateStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.httpObservation.setGalleryCreateStatus(false);
                    this.isLoadingResponse = false;
                    this.navigateToGalleryList();
                }
            })
        ).subscribe();

        this.subscriptionHttpObservationUpdate$ = this.httpObservation.galleryUpdateStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.httpObservation.setGalleryUpdateStatus(false);
                    this.isLoadingResponse = false;
                    this.navigateToGalleryList();
                }
            })
        ).subscribe();

        this.subscriptionHttpObservationError$ = this.httpObservation.errorStatus$.pipe(
            filter((x) => x),
            tap((response: any) => {
                if(response.error.headers.error === 'InvalidPropertyException') {
                    // TODO(yqni13): need to declare what errors to handle here
                    this.httpObservation.setEmailStatus(false);
                    this.isLoadingResponse = false;
                }
            })
        ).subscribe();
    }

    private initForm() {
        this.artworkForm = this.fb.group({
            id: new FormControl(null),
            referenceNr: new FormControl(null),
            artGenre: new FormControl('', Validators.required),
            imagePath: new FormControl(''),
            thumbnailPath: new FormControl(''),
            title: new FormControl(null),
            price: new FormControl(null),
            dimensions: new FormControl('', Validators.required),
            artMedium: new FormControl('', Validators.required),
            artTechnique: new FormControl('', Validators.required),
            publication: new FormControl('', Validators.required),
        })
    }

    private initEdit() {
        this.initForm();
        this.artworkForm.patchValue({
            id: this.artworkEntry?.gallery_id ?? null,
            referenceNr: this.artworkEntry?.reference_nr ?? null,
            artGenre: EnumValidators.getArtGenre(this.artworkEntry?.art_genre) ?? '',
            imagePath: this.artworkEntry?.image_path ?? '',
            thumbnailPath: this.artworkEntry?.thumbnail_path ?? '',
            title: this.artworkEntry?.title ?? null,
            price: this.artworkEntry?.price ?? null,
            dimensions: this.artworkEntry?.dimensions ?? '',
            artMedium: EnumValidators.isArtMedium(this.artworkEntry?.art_medium) ?? ArtMedium.canvas,
            artTechnique: EnumValidators.isArtTechnique(this.artworkEntry?.art_technique) ?? ArtTechnique.acrylic,
            publication: this.artworkEntry?.publication_year ?? '',
        })
    }

    getPublicationYearPlaceholder(): string {
        return (new Date().getFullYear()).toString();
    }

    onGenreChange(event: any) {
        if(Object.values(ArtGenre).includes(event.target?.value)) {
            this.hasGenre = true;
            this.galleryApi.sendRefNrPreviewRequest(event.target?.value).subscribe((response) => {
                const refNr = response.body?.body.referenceNr ?? null;
                this.artworkForm.get('referenceNr')?.setValue(refNr);
                this.configPathByRefNr(refNr);
            });
        }
    }

    configPathByRefNr(refNr: string | null) {
        if(!refNr) {
            return;
        }
        this.artworkForm.get('imagePath')?.setValue(`/assets/paintings/${refNr}.jpg`);
        this.artworkForm.get('thumbnailPath')?.setValue(`/assets/paintings_resized/${refNr}.jpg`);
    }

    onSubmit() {
        this.artworkForm.markAllAsTouched();
        if(this.artworkForm.invalid) {
            return;
        }

        this.isLoadingResponse = true;
        if(this.mode === CRUDMode.create) {
            this.galleryApi.setCreatePayload(this.artworkForm.getRawValue());
            this.galleryApi.sendCreateRequest().subscribe();
        } else if(this.mode === CRUDMode.update) {
            this.galleryApi.setUpdatePayload(this.artworkForm.getRawValue());
            this.galleryApi.sendUpdateRequest().subscribe();
        }
    }

    async cancel() {
        this.isLoadingResponse = true;
        await this.delay(500);
        this.isLoadingResponse = false;
        this.navigateToGalleryList();
    }

    remove() {
        if(this.mode === CRUDMode.update && this.entryId !== '') {
            this.isLoadingResponse = true;
            this.galleryApi.setIdParam(this.entryId);
            this.galleryApi.sendDeleteRequest().subscribe(async (response) => {
                await this.delay(500);
                this.isLoadingResponse = false;
                if(response.body?.body.deleted) {
                    this.navigateToGalleryList();
                }
            });
        }
    }

    navigateToGalleryList() {
        this.router.navigate(['/admin/gallery']);
    }

    ngOnDestroy() {
        this.subscriptionDataSharing$.unsubscribe();
        this.subscriptionHttpObservationCreate$.unsubscribe();
        this.subscriptionHttpObservationUpdate$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}