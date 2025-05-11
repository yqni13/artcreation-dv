import { CRUDMode } from './../../../../shared/enums/crud-mode.enum';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { filter, Subscription, tap } from "rxjs";
import { NewsItem } from "../../../../api/models/news-response.interface";
import { HttpObservationService } from "../../../../shared/services/http-observation.service";
import { Router } from "@angular/router";
import { AuthService } from "../../../../shared/services/auth.service";
import { DataShareService } from "../../../../shared/services/data-share.service";
import { NewsAPIService } from "../../../../api/services/news.api.service";
import { SortingOption } from '../../../../shared/enums/sorting-option.enum';
import { AbstractAdminListComponent } from '../../../../common/components/abstracts/admin-list.abstract.component';
import { AdminListImportsModule } from '../../../../common/helper/admin-list.imports.helper';
import { AdminRoute } from '../../../../api/routes/admin.route.enum';

@Component({
    selector: 'app-admin-news-list',
    templateUrl: './admin-news-list.component.html',
    styleUrl: '../../admin.component.scss',
    imports: [
        ...AdminListImportsModule
    ]
})
export class AdminNewsListComponent extends AbstractAdminListComponent implements OnInit, OnDestroy {

    protected newsList: NewsItem[];
    protected modifiedList: NewsItem[];
    protected SortingOptionEnum = SortingOption;

    private subscriptionHttpObservationFindAll$: Subscription;

    constructor(
        router: Router,
        fb: FormBuilder,
        auth: AuthService,
        dataSharing: DataShareService,
        httpObservation: HttpObservationService,
        private readonly newsApi: NewsAPIService,
    ) {
        super(router, fb, auth, dataSharing, httpObservation);
        this.newsList = [];
        this.modifiedList = [];

        this.subscriptionHttpObservationFindAll$ = new Subscription();
    }

    override ngOnInit() {
        super.ngOnInit();
        this.subscriptionHttpObservationFindAll$ = this.httpObservation.newsFindAllStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.httpObservation.setNewsFindAllStatus(false);
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

    onDateTimeChange(event: any) {
        const searchText = this.searchForm.get('searchText')?.value;
        if(searchText !== '') {
            this.filterListBySearchText(searchText);
        } else {
            this.modifiedList = this.newsList;
        }

        const sorting = event.target?.value ?? SortingOption.DESC;
        this.modifiedList = this.modifiedList.sort(
            (a,b) => {
                return sorting === SortingOption.DESC
                    ? new Date(a.created_on).getTime() - new Date(b.created_on).getTime()
                    : new Date(b.created_on).getTime() - new Date(a.created_on).getTime()
            }
        );
    }

    onSearchSubmit(initial: boolean = false) {
        const searchText = this.searchForm.get('searchText')?.value ?? '';
        if(searchText === '') {
            if(initial) {
                // need db call only at initialization
                this.isLoadingResponse = true;
                this.newsApi.sendGetAllRequest().subscribe(data => {
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
            data.text?.toLowerCase().includes(searchText)            
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

    override ngOnDestroy() {
        super.ngOnDestroy();
        this.subscriptionHttpObservationFindAll$.unsubscribe();
    }
}