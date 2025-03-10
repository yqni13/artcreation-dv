import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { TextInputComponent } from "../../../../common/components/form-components/text-input/text-input.component";
import { GalleryAPIService } from "../../../../api/services/gallery.api.service";
import { GalleryItem } from "../../../../api/models/gallery-response.interface";
import { CRUDMode } from "../../../../shared/enums/crud-mode.enum";
import { DataShareService } from "../../../../shared/services/data-share.service";
import { Router, RouterModule } from "@angular/router";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { CastAbstractToFormControlPipe } from "../../../../common/pipes/cast-abstracttoform-control.pipe";
import { SelectInputComponent } from "../../../../common/components/form-components/select-input/select-input.component";
import { ArtGenre } from "../../../../shared/enums/art-genre.enum";
import { AdminRoute } from "../../../../api/routes/admin.route.enum";
import { GalleryRoute } from "../../../../api/routes/gallery.route.enum";

@Component({
    selector: 'app-admin-gallery-list',
    templateUrl: './admin-gallery-list.component.html',
    styleUrl: './admin-gallery-list.component.scss',
    imports: [
        CastAbstractToFormControlPipe,
        CommonModule,
        RouterModule,
        SelectInputComponent,
        TextInputComponent,
        TranslateModule
    ]
})
export class AdminGalleryListComponent implements OnInit {

    protected galleryList: GalleryItem[];
    protected modifiedList: GalleryItem[];
    protected searchForm: FormGroup;
    protected hasSearchText: boolean;
    protected genreOptions: any;
    
    constructor(
        private readonly router: Router,
        private readonly fb: FormBuilder,
        private readonly galleryApi: GalleryAPIService,
        private readonly dataSharing: DataShareService
    ) {
        this.galleryList = [];
        this.modifiedList = [];
        this.searchForm = new FormGroup({});
        this.hasSearchText = false;
        this.genreOptions = {
            ...ArtGenre,
            all: 'all'
        }
    }

    ngOnInit() {
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

    onSearchTextChange(event: any) {
        this.hasSearchText = event.target?.value === '' ? false : true;
    }

    onGenreChange(event: any) {
        const searchText = this.searchForm.get('searchText')?.value;
        if(searchText !== '') {
            this.filterListBySearchText(searchText)
        } else {
            this.modifiedList = this.galleryList;
        }
        
        const genre = event.target?.value ?? 'all';
        if(genre !== this.genreOptions.all) {
            this.modifiedList = this.modifiedList.filter(data => data.art_genre === genre)
        }
    }

    onSearchSubmit(initial: boolean = false) {
        const searchText = this.searchForm.get('searchText')?.value ?? '';
        if(searchText === '') {
            if(initial) {
                // need db call only at initialization
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
        this.modifiedList = this.galleryList.filter((data) => 
            data.reference_nr.includes(searchText) ||
            data.title?.includes(searchText) ||
            data.dimensions.includes(searchText) ||
            data.art_medium.includes(searchText) ||
            data.art_technique.includes(searchText) ||
            String(data.publication_year).includes(searchText)
        );
    }

    removeKeyword() {
        this.searchForm.get('searchText')?.setValue('');
        this.hasSearchText = false;
        this.onSearchSubmit();
    }

    navigateToCreateItem() {
        const data = {
            mode: CRUDMode.create
        }

        this.dataSharing.setSharedData(data);
        this.router.navigate([`admin${AdminRoute.GALLERY}${GalleryRoute.CREATE}`]);
    }

    navigateToUpdateItem(id: string) {
        const data = {
            mode: CRUDMode.update,
            entryId: id,
            refNr: (this.galleryList.find(data => data.gallery_id === id))?.reference_nr
        }

        this.dataSharing.setSharedData(data);
        this.router.navigate([`admin${AdminRoute.GALLERY}/${data.refNr}`])
    }
}