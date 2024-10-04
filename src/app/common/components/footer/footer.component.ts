/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, HostListener, Inject, OnInit } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { Route, RouterModule } from "@angular/router";
import { CommonModule, DOCUMENT } from "@angular/common";
import { SnackbarMessageService } from "../../../shared/services/snackbar.service";
import { SnackbarOption } from "../../../shared/enums/snackbar-option.enum";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { LanguageOption } from "../../../shared/enums/language-option.enum";

@Component({
    selector: 'artdv-footer',
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

    @HostListener('window:click', ['$event'])
    clickOutside($event: any) {
        if(!$event.target.className.includes('artdv-language-element')) {
                this.showLanguageList = false;
            }
    }

    protected language = LanguageOption;
    protected selectedLanguage: LanguageOption;
    protected showLanguageList: boolean;
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

        this.showLanguageList = false;
        this.infoRoutes = [];
        this.connectRoutes = [];
        this.socialmediaURL = 'https://instagram.com/vargarella_';
        this.creatorURL = 'https://yqni13.com';
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
            const language = localStorage.getItem('artdv-language');

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

    protected setLanguageData(language: LanguageOption) {
        if(this.isLocalStorageAvailable) {
            if(language) {
                localStorage.setItem("artdv-language", language);
                this.switchLanguage(language);
                // change lang in index.html to prevent unwanted google translation
                this.document.querySelector('html')?.setAttribute('lang', language);
                return;
            }
        }
        
        this.document.querySelector('html')?.setAttribute('lang', 'de');
        this.switchLanguage(LanguageOption.de);
    }

    private switchLanguage(language: LanguageOption) {
        this.translate.use(language);
        this.selectedLanguage = language;
        this.showLanguageList = false;
    }

    protected openLanguageList() {
        this.showLanguageList = true;
    }
}