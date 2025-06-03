import { Component, OnInit } from "@angular/core";
import { AdminListImportsModule } from "../../../../common/helper/admin-list.imports.helper";
import { AbstractAdminListComponent } from "../../../../common/components/abstracts/admin-list.abstract.component";
import { Router } from "@angular/router";
import { FormBuilder, FormControl } from "@angular/forms";
import { AuthService } from "../../../../shared/services/auth.service";
import { DataShareService } from "../../../../shared/services/data-share.service";
import { HttpObservationService } from "../../../../shared/services/http-observation.service";
import { filter, tap } from "rxjs";
import { CRUDMode } from "../../../../shared/enums/crud-mode.enum";
import { AdminRoute } from "../../../../api/routes/admin.route.enum";
import { AssetsItem } from "../../../../api/models/assets.response.interface";
import { AssetsCategory } from "../../../../shared/enums/assets-category.enum";
import { AssetsAPIService } from "../../../../api/services/assets.api.service";

@Component({
    selector: 'app-admin-assets-list',
    templateUrl: './admin-assets-list.component.html',
    styleUrl: '../../admin.component.scss',
    imports: [
        ...AdminListImportsModule
    ]
})
export class AdminAssetsListComponent extends AbstractAdminListComponent implements OnInit {
    
    protected assetsList: AssetsItem[];
    protected modifiedList: AssetsItem[];
    protected AssetsCategoryEnum: any;
    
    constructor(
        router: Router,
        fb: FormBuilder,
        auth: AuthService,
        dataSharing: DataShareService,
        httpObservation: HttpObservationService,
        private readonly assetsApi: AssetsAPIService
    ) {
        super(router, fb, auth, dataSharing, httpObservation);
        this.assetsList = [];
        this.modifiedList = [];
        this.AssetsCategoryEnum = {
            ...AssetsCategory,
            ALL: 'all'
        };
    }

    ngOnInit() {
        this.subscriptionHttpObservationFindAll$ = this.httpObservation.assetsFindAllStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.httpObservation.setAssetsFindAllStatus(false);
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
            category: new FormControl('')
        });
    }

    private initEdit() {
        this.initForm();
        this.searchForm.patchValue({
            searchText: '',
            category: 'all'
        })
    }

    onCategoryChange(event: any) {
        const searchText = this.searchForm.get('searchText')?.value;
        if(searchText !== '') {
            this.filterListBySearchText(searchText);
        } else {
            this.modifiedList = this.assetsList;
        }

        const category = event.target?.value ?? 'all';
        if(category !== this.AssetsCategoryEnum.ALL) {
            this.modifiedList = this.modifiedList.filter(data => data.category === category);
        }
    }

    onSearchSubmit(initial: boolean = false) {
        const searchText = this.searchForm.get('searchText')?.value ?? '';
        if(searchText === '') {
            if(initial) {
                // need db call only at initialization
                this.isLoadingResponse = true;
                this.assetsApi.sendGetAllRequest().subscribe(data => {
                    this.assetsList = data.body?.body.data ?? [];
                    this.modifiedList = this.assetsList;
                });
            } else {
                this.modifiedList = this.assetsList;
                return;
            }
        } else {
            this.filterListBySearchText(searchText);
        }
    }

    filterListBySearchText(searchText: string) {
        searchText = searchText.toLowerCase();
        this.modifiedList = this.assetsList.filter((data) => {
            data.location?.toString().includes(searchText) ||
            data.datetime.toString().includes(searchText) ||
            data.created_on.toString().includes(searchText) ||
            data.last_modified.toString().includes(searchText)
        });
    }

    navigateToUpdateItem(id: string) {
        const data = {
            mode: CRUDMode.UPDATE,
            entryId: id,
        }
        this.dataSharing.setSharedData(data);
        this.router.navigate([`admin${AdminRoute.ASSETS}/${data.entryId}`])
    }
}