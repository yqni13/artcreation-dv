import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { AuthService } from "../../shared/services/auth.service";
import { Router, RouterModule } from "@angular/router";
import { SnackbarMessageService } from "../../shared/services/snackbar.service";
import { StaticTranslateService } from "../../shared/services/static-translation.service";
import { SnackbarOption } from "../../shared/enums/snackbar-option.enum";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss',
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule
    ]
})
export class AdminComponent {

    protected authorGalleryImg: string;
    protected authorNewsImg: string;
    protected authorAssetsImg: string;
    protected editLabel: string;

    constructor(
        private readonly router: Router,
        private readonly auth: AuthService,
        private readonly translate: TranslateService,
        private readonly snackbar: SnackbarMessageService,
        private readonly staticTranslate: StaticTranslateService
    ) {
        this.authorGalleryImg = 'https://pixabay.com/de/users/stocksnap-894430/';
        this.authorNewsImg = 'https://pixabay.com/de/photos/news-tageszeitung-presse-1172463/';
        this.authorAssetsImg = 'https://pixabay.com/de/users/tianya1223-4833799/';
        this.editLabel = 'edit: ';

        // Images are preloaded via ImgPreloadGuard (admin.routes.ts).
    }

    notAvailableInfo() {
        this.snackbar.notify({
            title: this.translate.currentLang === 'de'
                ? this.staticTranslate.getTranslationDE('common.unavailable.title')
                : this.staticTranslate.getTranslationEN('common.unavailable.title'),
            text: this.translate.currentLang === 'de'
                ? this.staticTranslate.getTranslationDE('common.unavailable.text')
                : this.staticTranslate.getTranslationEN('common.unavailable.text'),
            autoClose: false,
            type: SnackbarOption.info
        })
    }

    logout() {
        this.auth.logout();
        if(!this.auth.isLoggedIn()) {
            this.router.navigate(['login']);
        }
    }
}