import { CommonModule } from "@angular/common";
import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { TextInputComponent } from "../../../../common/components/form-components/text-input/text-input.component";
import { GalleryAPIService } from "../../../../api/services/gallery.api.service";
import { GalleryItem } from "../../../../api/models/gallery-response.interface";
import { CRUDMode } from "../../../../shared/enums/crud-mode.enum";
import { DataShareService } from "../../../../shared/services/data-share.service";
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { CastAbstractToFormControlPipe } from "../../../../common/pipes/cast-abstracttoform-control.pipe";
import { SelectInputComponent } from "../../../../common/components/form-components/select-input/select-input.component";
import { ArtGenre } from "../../../../shared/enums/art-genre.enum";
import { AdminRoute } from "../../../../api/routes/admin.route.enum";
import { GalleryRoute } from "../../../../api/routes/gallery.route.enum";
import { filter, Subscription, tap } from "rxjs";
import { HttpObservationService } from "../../../../shared/services/http-observation.service";
import { AuthService } from "../../../../shared/services/auth.service";
import { LoadingAnimationComponent } from "../../../../common/components/animation/loading/loading-animation.component";
import { BaseRoute } from "../../../../api/routes/base.route.enum";
import { environment } from "../../../../../environments/environment";

@Component({
    selector: 'app-admin-gallery-list',
    templateUrl: './admin-gallery-list.component.html',
    styleUrl: './admin-gallery-list.component.scss',
    imports: [
        CastAbstractToFormControlPipe,
        CommonModule,
        LoadingAnimationComponent,
        SelectInputComponent,
        TextInputComponent,
        TranslateModule
    ]
})
export class AdminGalleryListComponent implements OnInit, OnDestroy {
    @HostListener('window:keydown', ['$event'])
    navigateSearchByKey(event: KeyboardEvent) {
        if(event.key === 'Enter') {
            this.onSearchSubmit();
        } else if(event.key === 'Escape') {
            this.hasSearchText = false;
            this.searchForm.get('searchText')?.setValue('');
            this.onSearchSubmit();
        }
    }

    protected galleryList: GalleryItem[];
    protected modifiedList: GalleryItem[];
    protected searchForm: FormGroup;
    protected hasSearchText: boolean;
    protected genreOptions: any;
    protected isLoadingResponse: boolean;
    protected storageDomain: string;

    private subscriptionHttpObservationFindAll$: Subscription;
    private subscriptionHttpObservationError$: Subscription;
    private delay: any;
    
    constructor(
        private readonly router: Router,
        private readonly fb: FormBuilder,
        private readonly auth: AuthService,
        private readonly galleryApi: GalleryAPIService,
        private readonly dataSharing: DataShareService,
        private readonly httpObservation: HttpObservationService
    ) {
        this.galleryList = [];
        this.modifiedList = [];
        this.searchForm = new FormGroup({});
        this.hasSearchText = false;
        this.genreOptions = {
            ...ArtGenre,
            ALL: 'all'
        };
        this.isLoadingResponse = false;
        this.storageDomain = environment.STORAGE_URL;

        this.subscriptionHttpObservationFindAll$ = new Subscription();
        this.subscriptionHttpObservationError$ = new Subscription();
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    ngOnInit() {
        this.subscriptionHttpObservationFindAll$ = this.httpObservation.galleryFindAllStatus$.pipe(
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
            tap(async (response: any) => {
                if(this.auth.getExceptionList().includes(response.error.headers.error)) {
                    await this.delay(500); // delay after snackbar displays
                    this.httpObservation.setErrorStatus(false);
                    this.isLoadingResponse = false;
                }
            })
        ).subscribe();

        this.onSearchSubmit(true);
        this.initEdit();
    }

    private initForm() {
        this.searchForm = this.fb.group({
            searchText: new FormControl(''),
            genre: new FormControl('')
        });
    }

    private initEdit() {
        this.initForm();
        this.searchForm.patchValue({
            searchText: '',
            genre: 'all'
        })
    }

    onSearchTextChange(event: string) {
        this.hasSearchText = event !== '' ? true : false;
    }

    onGenreChange(event: any) {
        const searchText = this.searchForm.get('searchText')?.value;
        if(searchText !== '') {
            this.filterListBySearchText(searchText)
        } else {
            this.modifiedList = this.galleryList;
        }
        
        const genre = event.target?.value ?? 'all';
        if(genre !== this.genreOptions.ALL) {
            this.modifiedList = this.modifiedList.filter(data => data.art_genre === genre)
        }
    }

    onSearchSubmit(initial: boolean = false) {
        const searchText = this.searchForm.get('searchText')?.value ?? '';
        if(searchText === '') {
            if(initial) {
                // need db call only at initialization
                this.isLoadingResponse = true;
                this.galleryApi.sendGetAllRequest().subscribe(data => {
                    this.galleryList = data.body?.body.data ?? [];
                    this.modifiedList = this.galleryList;
                });
            } else {
                this.modifiedList = this.galleryList;
                return;
            }
        } else {
            this.filterListBySearchText(searchText);
        }
    }

    filterListBySearchText(searchText: string) {
        searchText = searchText.toLowerCase();
        this.modifiedList = this.galleryList.filter((data) => 
            (data.reference_nr).toLowerCase().includes(searchText) ||
            data.title?.toLowerCase().includes(searchText) ||
            data.dimensions.toLowerCase().includes(searchText) ||
            data.art_medium.toLowerCase().includes(searchText) ||
            data.art_technique.toLowerCase().includes(searchText) ||
            String(data.publication_year).toLowerCase().includes(searchText)
        );
    }

    removeKeyword() {
        this.searchForm.get('searchText')?.setValue('');
        this.hasSearchText = false;
        this.onSearchSubmit();
    }

    navigateToCreateItem() {
        const data = {
            mode: CRUDMode.CREATE
        }
        this.dataSharing.setSharedData(data);
        this.router.navigate([`${BaseRoute.ADMIN}${AdminRoute.GALLERY}${GalleryRoute.CREATE}`]);
    }

    navigateToUpdateItem(id: string) {
        const data = {
            mode: CRUDMode.UPDATE,
            entryId: id,
            refNr: (this.galleryList.find(data => data.gallery_id === id))?.reference_nr
        }
        this.dataSharing.setSharedData(data);
        this.router.navigate([`admin${AdminRoute.GALLERY}/${data.refNr}`])
    }

    navigateToDashboard() {
        this.router.navigate([BaseRoute.ADMIN]);
    }

    ngOnDestroy() {
        this.subscriptionHttpObservationFindAll$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}