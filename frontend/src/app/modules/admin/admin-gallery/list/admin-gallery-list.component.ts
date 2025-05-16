import { Component, OnInit } from "@angular/core";
import { GalleryAPIService } from "../../../../api/services/gallery.api.service";
import { GalleryItem } from "../../../../api/models/gallery-response.interface";
import { CRUDMode } from "../../../../shared/enums/crud-mode.enum";
import { DataShareService } from "../../../../shared/services/data-share.service";
import { Router } from "@angular/router";
import { FormBuilder, FormControl } from "@angular/forms";
import { ArtGenre } from "../../../../shared/enums/art-genre.enum";
import { AdminRoute } from "../../../../api/routes/admin.route.enum";
import { filter, tap } from "rxjs";
import { HttpObservationService } from "../../../../shared/services/http-observation.service";
import { AuthService } from "../../../../shared/services/auth.service";
import { AdminListImportsModule } from "../../../../common/helper/admin-list.imports.helper";
import { AbstractAdminListComponent } from "../../../../common/components/abstracts/admin-list.abstract.component";

@Component({
    selector: 'app-admin-gallery-list',
    templateUrl: './admin-gallery-list.component.html',
    styleUrl: '../../admin.component.scss',
    imports: [
        ...AdminListImportsModule
    ]
})
export class AdminGalleryListComponent extends AbstractAdminListComponent implements OnInit {

    protected galleryList: GalleryItem[];
    protected modifiedList: GalleryItem[];
    protected GenreOptionEnum: any;
    
    constructor(
        router: Router,
        fb: FormBuilder,
        auth: AuthService,
        dataSharing: DataShareService,
        httpObservation: HttpObservationService,
        private readonly galleryApi: GalleryAPIService,
    ) {
        super(router, fb, auth, dataSharing, httpObservation);
        this.galleryList = [];
        this.modifiedList = [];
        this.GenreOptionEnum = {
            ...ArtGenre,
            ALL: 'all'
        };
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

    onGenreChange(event: any) {
        const searchText = this.searchForm.get('searchText')?.value;
        if(searchText !== '') {
            this.filterListBySearchText(searchText);
        } else {
            this.modifiedList = this.galleryList;
        }
        
        const genre = event.target?.value ?? 'all';
        if(genre !== this.GenreOptionEnum.ALL) {
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

    navigateToUpdateItem(id: string) {
        const data = {
            mode: CRUDMode.UPDATE,
            entryId: id,
            refNr: (this.galleryList.find(data => data.gallery_id === id))?.reference_nr
        }
        this.dataSharing.setSharedData(data);
        this.router.navigate([`admin${AdminRoute.GALLERY}/${data.refNr}`])
    }
}