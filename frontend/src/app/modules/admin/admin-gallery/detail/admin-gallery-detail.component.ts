import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
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
export class AdminGalleryDetailComponent implements OnInit, OnDestroy{

    protected artworkForm: FormGroup;
    protected mode: CRUDMode;
    protected modeOptions = CRUDMode;
    protected genreOptions = ArtGenre;
    protected mediumOptions = ArtMedium;
    protected techniqueOptions = ArtTechnique
    protected artWorkEntry: GalleryItem | null;
    protected isLoadingResponse: boolean;
    protected isLoadingInit: boolean;
    protected hasGenre: boolean;

    private subscriptionDataSharing$: Subscription;
    private entryId: string;
    private delay: any;

    constructor(
        private readonly router: Router,
        private readonly fb: FormBuilder,
        private readonly navigate: NavigationService,
        private readonly galleryApi: GalleryAPIService,
        private readonly dataSharing: DataShareService
    ) {
        this.artworkForm = new FormGroup({});
        this.mode = CRUDMode.update;
        this.artWorkEntry = null;
        this.isLoadingResponse = true;
        this.isLoadingInit = true;
        
        this.subscriptionDataSharing$ = new Subscription();
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
                        (this.artWorkEntry as any) = data.body?.body.data;
                        this.hasGenre = this.artWorkEntry?.art_genre ? true : false;
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

    private initForm() {
        this.artworkForm = this.fb.group({
            genre: new FormControl('', Validators.required),
            imgPath: new FormControl(''),
            thumbnailPath: new FormControl(''),
            title: new FormControl(null),
            price: new FormControl(null),
            dimensions: new FormControl('', Validators.required),
            medium: new FormControl('', Validators.required),
            technique: new FormControl('', Validators.required),
            publication: new FormControl('', Validators.required)
        })
    }

    private initEdit() {
        this.initForm();
        this.artworkForm.patchValue({
            genre: EnumValidators.getArtGenre(this.artWorkEntry?.art_genre) ?? '',
            imgPath: this.artWorkEntry?.image_path ?? '',
            thumbnailPath: this.artWorkEntry?.thumbnail_path ?? '',
            title: this.artWorkEntry?.title ?? null,
            price: this.artWorkEntry?.price ?? null,
            dimensions: this.artWorkEntry?.dimensions ?? '',
            medium: EnumValidators.isArtMedium(this.artWorkEntry?.art_medium) ?? ArtMedium.canvas,
            technique: EnumValidators.isArtTechnique(this.artWorkEntry?.art_technique) ?? ArtTechnique.acrylic,
            publication: this.artWorkEntry?.publication_year ?? '',
        })
    }

    getPublicationYearPlaceholder(): string {
        return (new Date().getFullYear()).toString();
    }

    onGenreChange(event: any) {
        if(!this.hasGenre && Object.values(ArtGenre).includes(event.target?.value)) {
            this.hasGenre = true;
        }
    }

    onSubmit() {
        this.artworkForm.markAllAsTouched();
        if(this.artworkForm.invalid) {
            return;
        }

        this.isLoadingResponse = true;
        if(this.mode === CRUDMode.create) {
            // send create request
        } else if(this.mode === CRUDMode.update) {
            // send update request
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
    }
}