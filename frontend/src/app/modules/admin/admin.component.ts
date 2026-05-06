import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { AuthService } from "../../shared/services/auth.service";
import { RouterModule } from "@angular/router";
import { SnackbarMessageService } from "../../shared/services/snackbar.service";
import { StaticTranslateService } from "../../shared/services/static-translation.service";
import { SnackbarOption } from "../../shared/enums/snackbar-option.enum";
import { ThemeOption } from "../../shared/enums/theme-option.enum";
import { ThemeObservationService } from "../../shared/services/theme-observation.service";
import { Subscription, tap } from "rxjs";

@Component({
    selector: 'app-admin',
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule
    ],
    templateUrl: './admin.component.html',
    styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit, OnDestroy {

    private readonly auth = inject(AuthService);
    private readonly translate = inject(TranslateService);
    private readonly snackbar = inject(SnackbarMessageService);
    private readonly themeObserve = inject(ThemeObservationService);
    private readonly staticTranslate = inject(StaticTranslateService);

    protected authorGalleryImg = 'https://pixabay.com/de/users/stocksnap-894430/';
    protected authorNewsImg = 'https://pixabay.com/de/photos/news-tageszeitung-presse-1172463/';
    protected authorAssetsImg = 'https://pixabay.com/de/users/tianya1223-4833799/';
    protected ThemeOptionEnum = ThemeOption;
    protected currentTheme: ThemeOption = ThemeOption.darkMode;
    protected editLabel = 'edit: ';

    private subscriptionThemeObservation$ = new Subscription();

    ngOnInit() {
        this.subscriptionThemeObservation$ = this.themeObserve.themeOption$.pipe(
            tap((theme: ThemeOption) => {
                this.currentTheme = theme;
            })
        ).subscribe();
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
    }

    ngOnDestroy() {
        this.subscriptionThemeObservation$.unsubscribe();
    }
}