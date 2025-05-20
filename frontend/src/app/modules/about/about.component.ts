import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss',
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class AboutComponent {

    constructor() {
        // Images are preloaded via ImgPreloadGuard (admin.routes.ts).
    }
}