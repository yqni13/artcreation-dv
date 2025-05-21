import { CommonModule } from "@angular/common";
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";
import { ImgPreloadService } from "../../../shared/services/img-preload.service";
import { CacheCheckPipe } from "../../pipes/cache-check.pipe";

@Component({
    selector: 'artdv-imgfullscale',
    template: `
        <div 
            *ngIf="isActive && isPreloaded"
            class="artdv-imgfullscale-wrapper" 
            [attr.aria-disabled]="true"
            (click)="closeFullscale(false)"
            (keydown.enter)="closeFullscale(false)" 
        >
            <img src="{{imgPath | cacheCheck: lastModifiedParam ?? ''}}" alt="404-picture-not-found">
        </div>
    `,
    styleUrl: "./img-fullscale.component.scss",
    imports: [
        CacheCheckPipe,
        CommonModule
    ],
    providers: [CacheCheckPipe]
})
export class ImgFullscaleComponent implements OnInit {
    @HostListener('window:keydown', ['$event'])
    closeOnEscape(event: KeyboardEvent) {
        if(event.key === 'Escape') {
            this.closeFullscale(false);
        }
    }

    @Input() imgPath: string;
    @Input() isActive: boolean;
    @Input() lastModifiedParam: string | null;

    @Output() fullscaleChanged = new EventEmitter<boolean>();

    protected isPreloaded: boolean;

    constructor(
        private readonly imgPreload: ImgPreloadService,
        private readonly cacheCheckPipe: CacheCheckPipe
    ) {
        this.imgPath = '';
        this.isActive = false;
        this.lastModifiedParam = '';

        this.isPreloaded = false;
    }

    ngOnInit() {
        this.imgPreload.preloadMultiple([
            `${this.cacheCheckPipe.transform(this.imgPath, this.lastModifiedParam ?? '')}`
        ]).finally(() => {
            this.isPreloaded = true;
        })
    }

    closeFullscale(flag: boolean) {
        this.isActive = flag;
        this.fullscaleChanged.emit(flag);
    }
}