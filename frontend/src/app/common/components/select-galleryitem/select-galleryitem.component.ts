/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from "@angular/common";
import { Component, computed, inject, input, OnDestroy, OnInit, output, signal } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { GalleryItem } from "../../../api/interfaces/gallery-response.interface";
import { filter, Subscription, tap } from "rxjs";
import { GalleryAPIService } from "../../../api/services/gallery.api.service";
import { HttpObservationService } from "../../../shared/services/http-observation.service";
import { AuthService } from "../../../shared/services/auth.service";
import { environment } from "../../../../environments/environment";
import { LoadingAnimationComponent } from "../animation/loading/loading-animation.component";

@Component({
    selector: 'artdv-select-galleryitem',
    imports: [
        CommonModule,
        LoadingAnimationComponent,
        TranslateModule
    ],
    templateUrl: './select-galleryitem.component.html',
    styleUrl: './select-galleryitem.component.scss',
    host: {
        '(window:keydown)': 'closeOnEscape($event)'
    }
})
export class SelectGalleryItemComponent implements OnInit, OnDestroy {

    private readonly auth = inject(AuthService);
    private readonly galleryApi = inject(GalleryAPIService);
    private readonly httpObservation = inject(HttpObservationService);

    readonly emptyOnSubmit = input(false);
    protected isEmptyOnSubmit = computed(() => this.emptyOnSubmit() && !this.hasSelectedItem());
    readonly existingImgPath = input<string | null>(null);
    protected readonly showInUpdateMode = computed(() => this.existingImgPath() && !this.hasRemovedExistingImg());

    readonly byChange = output<string | null>();

    protected galleryList: GalleryItem[] | null = null;
    protected selectedArtwork: GalleryItem | null = null;
    protected hasSelectedItem = signal(false);
    protected hasRemovedExistingImg = signal(false);
    protected showGalleryList = false;
    protected isLoadingResponse = false;
    protected storageDomain = environment.STORAGE_URL.trim();
    protected showValidationMessage = false;

    private subscriptionHttpObservationFindAll$ = new Subscription();
    private subscriptionHttpObservationError$ = new Subscription();
    private delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));;

    ngOnInit() {
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

    closeGalleryList() {
        this.showGalleryList = false;
        this.isLoadingResponse = false;
        this.hasSelectedItem.set(false);
        this.showValidationMessage = true;
        this.selectedArtwork = null;
    }

    selectArtwork(id: string) {
        this.selectedArtwork = this.galleryList?.find(data => data.gallery_id === id) ?? null;
        this.byChange.emit(id);
        this.hasSelectedItem.set(true);
        this.showValidationMessage = false;
        this.showGalleryList = false;
    }

    removeImage() {
        this.selectedArtwork = null;
        this.byChange.emit(null);
        this.hasSelectedItem.set(false);
        this.showValidationMessage = true;
        this.hasRemovedExistingImg.set(true);
    }

    closeOnEscape(event: KeyboardEvent) {
        if(event.key === 'Escape' && this.showGalleryList) {
            this.closeGalleryList();
        }
    }

    ngOnDestroy() {
        this.subscriptionHttpObservationFindAll$.unsubscribe();
        this.subscriptionHttpObservationError$.unsubscribe();
    }
}