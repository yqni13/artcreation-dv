import { CRUDMode } from './../../../../shared/enums/crud-mode.enum';
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { filter, tap } from "rxjs";
import { NewsItemWGP } from "../../../../api/interfaces/news-response.interface";
import { NewsAPIService } from "../../../../api/services/news.api.service";
import { SortingOption } from '../../../../shared/enums/sorting-option.enum';
import { AbstractAdminListComponent } from '../../../../common/components/abstracts/admin-list.abstract.component';
import { AdminListImportsModule } from '../../../../common/helper/admin-list.imports.helper';
import { AdminRoute } from '../../../../api/routes/admin.route.enum';
import { FilterNewsService } from '../../../../shared/services/filter-news.service';

@Component({
    selector: 'app-admin-news-list',
    imports: [
        ...AdminListImportsModule
    ],
    templateUrl: './admin-news-list.component.html',
    styleUrl: '../../admin.component.scss'
})
export class AdminNewsListComponent extends AbstractAdminListComponent implements OnInit, OnDestroy {

    private readonly newsApi = inject(NewsAPIService);
    private readonly newsFilter = inject(FilterNewsService);

    protected newsList: NewsItemWGP[] = [];
    protected modifiedList: NewsItemWGP[] = [];
    protected SortingOptionEnum = SortingOption;

    constructor() {
        super();
    }

    ngOnInit() {
        this.subscriptionHttpObservationFindAll$ = this.httpObservation.newsFindAllWithGalleryPathsStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.httpObservation.setNewsFindAllWithGalleryPathsStatus(false);
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
            sorting: new FormControl('')
        });
    }

    private initEdit() {
        this.initForm();
        this.searchForm.patchValue({
            searchText: '',
            sorting: SortingOption.DESC
        })
    }

    onDateTimeChange(event: Event) {
        const searchText = this.searchForm.get('searchText')?.value;
        if(searchText !== '') {
            this.filterListBySearchText(searchText);
        } else {
            this.modifiedList = this.newsList;
        }

        const element = event.target as HTMLInputElement;
        const sorting = (element?.value as SortingOption) ?? SortingOption.DESC;
        this.modifiedList = this.newsFilter.filterByKeyValue(sorting, this.modifiedList);
    }

    onSearchSubmit(initial = false) {
        const searchText = this.searchForm.get('searchText')?.value ?? '';
        if(searchText === '') {
            if(initial) {
                // need db call only at initialization
                this.isLoadingResponse = true;
                this.newsApi.sendGetAllWithGalleryPathsRequest().subscribe(data => {
                    this.newsList = data.body?.body.data ?? [];
                    this.modifiedList = this.newsList;
                });
            } else {
                this.modifiedList = this.newsList;
                return;
            }
        } else {
            this.filterListBySearchText(searchText);
        }
    }

    filterListBySearchText(searchText: string) {
        searchText = searchText.toLowerCase();
        this.modifiedList = this.newsList.filter((data) => 
            data.created_on.toString().includes(searchText) ||
            data.last_modified.toString().includes(searchText) ||
            data.title?.toLowerCase().includes(searchText) ||
            data.content?.toLowerCase().includes(searchText)            
        );
    }

    navigateToUpdateItem(id: string) {
        const data = {
            mode: CRUDMode.UPDATE,
            entryId: id,
        }
        this.dataSharing.setSharedData(data);
        this.router.navigate([`admin${AdminRoute.NEWS}/${data.entryId}`])
    }
}