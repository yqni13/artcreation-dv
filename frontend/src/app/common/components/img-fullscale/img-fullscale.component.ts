import { Component, computed, inject, input, OnInit, output, signal } from "@angular/core";
import { ImgPreloadService } from "../../../shared/services/img-preload.service";
import { CacheCheckPipe } from "../../pipes/cache-check.pipe";

@Component({
    selector: 'artdv-imgfullscale',
    imports: [
        CacheCheckPipe
    ],
    template: `
        @if (active() && isPreloaded) {
            <div
                class="artdv-imgfullscale-wrapper"
                [attr.aria-disabled]="true"
                (click)="closeFullscale(false)"
                (keydown.enter)="closeFullscale(false)"
            >
                <img src="{{imgPath() | cacheCheck: lastModifiedParam() ?? ''}}" alt="404-picture-not-found">
            </div>
        }
    `,
    styleUrl: "./img-fullscale.component.scss",
    providers: [CacheCheckPipe],
    host: {
        '(document:keydown.escape)': 'closeFullscale(false)'
    }
})
export class ImgFullscaleComponent implements OnInit {

    private readonly imgPreload = inject(ImgPreloadService);
    private readonly cacheCheckPipe = inject(CacheCheckPipe);

    readonly imgPath = input.required<string>();
    readonly lastModifiedParam = input<string | null>();
    readonly isActive = input(false);
    protected readonly active = computed(() => this.isActive() || this.isActiveOverwrite());

    readonly fullscaleChanged = output<boolean>();

    protected isPreloaded = false;
    private readonly isActiveOverwrite = signal(false);

    ngOnInit() {
        this.imgPreload.preloadMultiple([
            `${this.cacheCheckPipe.transform(this.imgPath(), this.lastModifiedParam() ?? '')}`
        ]).finally(() => {
            this.isPreloaded = true;
        })
    }

    closeFullscale(flag: boolean) {
        this.isActiveOverwrite.set(flag);
        this.fullscaleChanged.emit(flag);
    }
}