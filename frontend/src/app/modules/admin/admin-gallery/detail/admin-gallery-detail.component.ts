import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, ReactiveFormsModule } from "@angular/forms";
import { CRUDMode } from "../../../../shared/enums/crud-mode.enum";
import { Router } from "@angular/router";
import { filter, Subscription, tap } from "rxjs";
import { DataShareService } from "../../../../shared/services/data-share.service";
import { NavigationService } from "../../../../shared/services/navigation.service";

@Component({
    selector: 'app-admin-gallery-detail',
    templateUrl: './admin-gallery-detail.component.html',
    styleUrl: './admin-gallery-detail.component.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule
    ]
})
export class AdminGalleryDetailComponent implements OnInit, OnDestroy{

    protected mode: CRUDMode;
    protected modeOptions = CRUDMode;

    private subscriptionDataSharing$: Subscription;

    constructor(
        private readonly router: Router,
        private readonly fb: FormBuilder,
        private readonly navigate: NavigationService,
        private readonly dataSharing: DataShareService
    ) {
        this.mode = CRUDMode.update;
        

        this.subscriptionDataSharing$ = new Subscription();
    }

    ngOnInit() {
        // do not remain in component after page refresh
        if(this.navigate.getPreviousUrl() === 'UNAVAILABLE') {
            this.router.navigate(['admin/gallery']);
        }

        this.subscriptionDataSharing$ = this.dataSharing.sharedData$.pipe(
            filter((x) => !!x),
            tap((data) => {
                this.mode = data.mode;
            })
        ).subscribe();
    }

    

    ngOnDestroy() {
        this.subscriptionDataSharing$.unsubscribe();
    }
}