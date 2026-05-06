import { Component, inject } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
    selector: 'app-about',
    imports: [
        CommonModule,
        TranslateModule
    ],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss'
})
export class AboutComponent {

    private sanitizer = inject(DomSanitizer);

    // Youtube embedded via iframe needs structure: '...youtube.com/' + 'embed/' + VIDEO_ID.
    private ytUrl = 'https://www.youtube.com/embed/Y0EGDisZ0Ww';
    protected safeUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.ytUrl);
}