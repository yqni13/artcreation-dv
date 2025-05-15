import { CommonModule } from "@angular/common";
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { GalleryItem } from "../../../api/models/gallery-response.interface";
import { filter, Subject, Subscription, tap } from "rxjs";
import { GalleryAPIService } from "../../../api/services/gallery.api.service";
import { HttpObservationService } from "../../../shared/services/http-observation.service";
import { AuthService } from "../../../shared/services/auth.service";
import { environment } from "../../../../environments/environment";
import { LoadingAnimationComponent } from "../animation/loading/loading-animation.component";

@Component({
    selector: 'artdv-select-galleryitem',
    templateUrl: './select-galleryitem.component.html',
    styleUrl: './select-galleryitem.component.scss',
    imports: [
        CommonModule,
        LoadingAnimationComponent,
        TranslateModule
    ]
})
export class SelectGalleryItemComponent implements OnInit, OnDestroy {

    @HostListener('window:keydown', ['$event'])
    closeOnEscape(event: KeyboardEvent) {
        if(event.key === 'Escape') {
            this.showGalleryList = false;
            this.isLoadingResponse = false;
            this.hasSelectedItem = false;
            this.selectedArtwork = null;
        }
    }

    @Input() isSubmitTriggered: Subject<boolean>;
    @Input() showInUpdateMode: string | null;

    @Output() byChange: EventEmitter<any>;

    protected galleryList: GalleryItem[] | null;
    protected selectedArtwork: GalleryItem | null;
    protected hasSelectedItem: boolean;
    protected showGalleryList: boolean;
    protected isLoadingResponse: boolean;
    protected storageDomain: string;
    protected showValidationMessage: boolean;

    private subscriptionSubmitTrigger$: Subscription;
    private subscriptionHttpObservationFindAll$: Subscription;
    private subscriptionHttpObservationError$: Subscription;
    private delay: any;

    constructor(
        private readonly auth: AuthService,
        private readonly galleryApi: GalleryAPIService,
        private readonly httpObservation: HttpObservationService
    ) {
        this.isSubmitTriggered = new Subject<boolean>();
        this.showInUpdateMode = null;
        this.byChange = new EventEmitter<string>();

        this.galleryList = null;
        this.selectedArtwork = null;
        this.hasSelectedItem = false;
        this.showGalleryList = false;
        this.isLoadingResponse = false;
        this.storageDomain = environment.STORAGE_URL;
        this.showValidationMessage = false;

        this.subscriptionSubmitTrigger$ = new Subscription();
        this.subscriptionHttpObservationFindAll$ = new Subscription();
        this.subscriptionHttpObservationError$ = new Subscription();
        this.delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    }

    ngOnInit() {
        this.subscriptionSubmitTrigger$ = this.isSubmitTriggered.subscribe((isValid: boolean) => {
            this.showValidationMessage = !isValid;
        })

        this.subscriptionHttpObservationFindAll$ = this.httpObservation.galleryFindAllStatus$.pipe(
            filter((x) => x !== null && x !== undefined),
            tap((isStatus200: boolean) => {
                if(isStatus200) {
                    this.httpObservation.setGalleryFindAllStatus(false);
                    this.showGalleryList = true;
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
    }

    openGalleryList() {
        this.showValidationMessage = false;
        if(this.galleryList === null) {
            this.isLoadingResponse = true;
            this.galleryApi.sendGetAllRequest().subscribe(data => {
                (this.galleryList as GalleryItem[] | undefined) = data.body?.body.data;
            });
        } else {
            this.showGalleryList = true;
        }
    }

    selectArtwork(id: string) {
        this.selectedArtwork = this.galleryList?.find(data => data.gallery_id === id) ?? null;
        this.byChange.emit(id);
        this.isSubmitTriggered.next(true);
        this.hasSelectedItem = true;
        this.showGalleryList = false;
    }

    removeImage() {
        this.selectedArtwork = null;
        this.byChange.emit(null);
        this.hasSelectedItem = false;
        this.showValidationMessage = false;
        this.showInUpdateMode = null;
    }

    ngOnDestroy() {
        this.subscriptionSubmitTrigger$.unsubscribe();
        this.subscriptionHttpObservationFindAll$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}