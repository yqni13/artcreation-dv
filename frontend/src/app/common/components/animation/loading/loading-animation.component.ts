import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { SizeOption } from "../../../../shared/enums/size-option.enum";

@Component({
    selector: 'artdv-loading-animation',
    template: `
        <div
            class="artdv-loading-animation"
            [ngClass]="sizeMode === SizeOptionEnum.GLOBAL 
                ? 'artdv-loading-animation-global'
                : 'artdv-loading-animation-component'"
        >
            <div class="artdv-loader">
                <div class="artdv-loader-bar1"></div>
                <div class="artdv-loader-bar2"></div>
                <div class="artdv-loader-bar3"></div>
                <div class="artdv-loader-bar4"></div>
                <div class="artdv-loader-bar5"></div>
                <div class="artdv-loader-bar6"></div>
            </div>
        </div>
    `,
    styleUrl: './loading-animation.component.scss',
    imports: [
        CommonModule
    ]
})
export class LoadingAnimationComponent {

    @Input() sizeMode?: SizeOption;

    protected SizeOptionEnum = SizeOption;

    constructor() {
        this.sizeMode = SizeOption.GLOBAL;
    }
}