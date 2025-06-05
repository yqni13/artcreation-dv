import { Component, Input } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { CommonModule } from "@angular/common";
import { AssetsItem } from "../../../api/models/assets.response.interface";
import { CacheCheckPipe } from "../../pipes/cache-check.pipe";
import { DateFormatPipe } from "../../pipes/date-format.pipe";
import { SizeOption } from "../../../shared/enums/size-option.enum";
import { LoadingAnimationComponent } from "../animation/loading/loading-animation.component";

@Component({
    selector: 'artdv-carouselmedia',
    templateUrl: './carousel-media.component.html',
    styleUrl: './carousel-media.component.scss',
    imports: [
        CacheCheckPipe,
        CommonModule,
        DateFormatPipe,
        LoadingAnimationComponent
    ]
})
export class CarouselMediaComponent {

    @Input() entries: AssetsItem[];
    @Input() isLoadingResponse!: boolean;

    protected index: number;
    protected storageDomain: string;
    protected SizeOptionEnum = SizeOption;

    constructor() {
        this.entries = [];
        this.index = 0;
        this.storageDomain = environment.STORAGE_URL;
    }

    getTransform() {
        return `translateX(${-this.index * 100}%)`;
    }

    next() {
        this.index = !this.isLoadingResponse
            ? ((this.index + 1) % this.entries.length)
            : this.index;
    }

    prev() {
        this.index = !this.isLoadingResponse 
            ? ((this.index - 1 + this.entries.length) % this.entries.length)
            : this.index;
    }
}