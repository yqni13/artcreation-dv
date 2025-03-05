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

@Component({
    selector: 'app-admin-gallery-list',
    templateUrl: './admin-gallery-list.component.html',
    styleUrl: './admin-gallery-list.component.scss',
    imports: [
        CastAbstractToFormControlPipe,
        CommonModule,
        RouterModule,
        TextInputComponent,
        TranslateModule
    ]
})
export class AdminGalleryListComponent implements OnInit {

    protected galleryList: GalleryItem[];
    protected searchForm: FormGroup;
    protected hasSearchText: boolean;
    
    constructor(
        private readonly router: Router,
        private readonly fb: FormBuilder,
        private readonly galleryApi: GalleryAPIService,
        private readonly dataSharing: DataShareService
    ) {
        this.galleryList = [];
        this.searchForm = new FormGroup({});
        this.hasSearchText = false;
    }

    ngOnInit() {
        this.onSearchSubmit();
        this.initEdit();
    }

    private initForm() {
        this.searchForm = this.fb.group({
            searchText: new FormControl('')
        });
    }

    private initEdit() {
        this.initForm();
        this.searchForm.patchValue({
            searchText: ''
        })
    }

    onSearchTextChange(event: any) {
        this.hasSearchText = event.target?.value === '' ? false : true;
    }

    onSearchSubmit() {
        const searchText = this.searchForm.get('searchText')?.value ?? '';
        if(searchText === '') {
            this.galleryApi.sendGetAllRequest().subscribe(data => {
                this.galleryList = data.body?.body.data ?? [];
            });
            return;
        }

        this.galleryList = this.galleryList.filter((data) => 
            data.reference_nr.includes(searchText) ||
            data.title?.includes(searchText) ||
            data.dimensions.includes(searchText) ||
            data.art_genre.includes(searchText) ||
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
        this.router.navigate(['admin/gallery/create']);
    }

    navigateToUpdateItem(id: string) {
        const data = {
            mode: CRUDMode.update,
            item: this.galleryList.find(data => data.gallery_id === id)
        }

        this.dataSharing.setSharedData(data);
        this.router.navigate([`admin/gallery/${data.item?.reference_nr}`])
    }
}