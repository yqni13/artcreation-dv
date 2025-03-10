import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
    selector: 'artdv-loading-animation',
    template: `
        <div class="artdv-loading-animation">
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
    constructor() {
        //
    }
}