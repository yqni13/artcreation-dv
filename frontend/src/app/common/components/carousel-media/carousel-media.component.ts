import { Component, input } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { CommonModule } from "@angular/common";
import { AssetsItem } from "../../../api/interfaces/assets.response.interface";
import { CacheCheckPipe } from "../../pipes/cache-check.pipe";
import { DateFormatPipe } from "../../pipes/date-format.pipe";
import { SizeOption } from "../../../shared/enums/size-option.enum";
import { LoadingAnimationComponent } from "../animation/loading/loading-animation.component";

@Component({
    selector: 'artdv-carouselmedia',
    imports: [
        CacheCheckPipe,
        CommonModule,
        DateFormatPipe,
        LoadingAnimationComponent
    ],
    templateUrl: './carousel-media.component.html',
    styleUrl: './carousel-media.component.scss'
})
export class CarouselMediaComponent {

    readonly entries = input<AssetsItem[]>([]);
    readonly isLoadingResponse = input<boolean>();

    protected index = 0;
    protected storageDomain = environment.STORAGE_URL.trim();
    protected readonly SizeOptionEnum = SizeOption;

    getTransform() {
        return `translateX(${-this.index * 100}%)`;
    }

    next() {
        this.index = !this.isLoadingResponse()
            ? ((this.index + 1) % this.entries().length)
            : this.index;
    }

    prev() {
        this.index = !this.isLoadingResponse() 
            ? ((this.index - 1 + this.entries().length) % this.entries().length)
            : this.index;
    }
}