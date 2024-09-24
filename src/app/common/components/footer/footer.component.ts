/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject, OnInit } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { Route, RouterModule } from "@angular/router";
import { CommonModule, DOCUMENT } from "@angular/common";
import { SnackbarMessageService } from "../../../shared/services/snackbar.service";
import { SnackbarOption } from "../../../shared/enums/snackbar-option.enum";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { LanguageOption } from "../../../shared/enums/language-option.enum";

@Component({
    selector: 'agal-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule
    ]
})
export class FooterComponent implements OnInit {

    protected language = LanguageOption;
    protected selectedLanguage: LanguageOption;
    protected infoRoutes: Route[];
    protected connectRoutes: Route[];
    protected socialmediaURL: string;
    protected creatorURL: string;

    private isLocalStorageAvailable: any;

    constructor(
        private snackbarService: SnackbarMessageService,
        @Inject(DOCUMENT) private document: Document,
        private navigation: NavigationService,
        private translate: TranslateService
    ) {
        this.isLocalStorageAvailable = typeof localStorage !== 'undefined';
        this.selectedLanguage = this.checkLanguageData();
        this.setLanguageData(this.selectedLanguage);

        this.infoRoutes = [];
        this.connectRoutes = [];
        this.socialmediaURL = 'https://instagram.com/vargarella_';
        this.creatorURL = 'https://yqni13.github.io/portfolio';
    }

    ngOnInit() {
        this.connectRoutes = this.getConnectRoutes();
        this.infoRoutes = this.getInfoRoutes();
    }

    private getInfoRoutes(): Route[] {
        return this.navigation.getFooterInfoRoutes();
    }

    private getConnectRoutes(): Route[] {
        return this.navigation.getFooterConnectRoutes();
    }

    alertAvailability() {
        this.snackbarService.notify({
            title: 'Shipping not available.',
            autoClose: true,
            type: SnackbarOption.error
        })
    }

    private checkLanguageData(): LanguageOption {
        if(this.isLocalStorageAvailable) {
            const language = localStorage.getItem('agal-language');

            if(!language) {
                return LanguageOption.de;
            }

            switch(String(language)) {
                case('de'):
                    return LanguageOption.de;
                case('en'):
                    return LanguageOption.en;
                default:
                    return LanguageOption.de;
            }
        }
        
        return LanguageOption.de;
    }

    private setLanguageData(language: LanguageOption) {
        if(this.isLocalStorageAvailable) {
            if(language) {
                localStorage.setItem("agal-language", language);
                this.switchLanguage(language);
                return;
            }
        }

        this.switchLanguage(LanguageOption.de);
    }

    protected switchLanguage(language: LanguageOption) {
        this.translate.use(language);
    }

    protected openLanguageList() {
        console.log();
    }
}