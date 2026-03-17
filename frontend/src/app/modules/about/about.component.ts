import { Component } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

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

    protected safeUrl: SafeResourceUrl;

    private ytUrl: string;

    constructor(private sanitizer: DomSanitizer) {
        // Images are preloaded via ImgPreloadGuard (admin.routes.ts).

        // Youtube embedded via iframe needs structure: '...youtube.com/' + 'embed/' + VIDEO_ID.
        this.ytUrl = 'https://www.youtube.com/embed/Y0EGDisZ0Ww';

        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.ytUrl);
    }
}