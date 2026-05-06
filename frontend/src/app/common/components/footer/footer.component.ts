/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, inject } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { Route, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SnackbarMessageService } from "../../../shared/services/snackbar.service";
import { SnackbarOption } from "../../../shared/enums/snackbar-option.enum";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { LanguageOption } from "../../../shared/enums/language-option.enum";

@Component({
    selector: 'artdv-footer',
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule
    ],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    host: {
        '(window:click)': 'clickOutside($event)'
    }
})
export class FooterComponent implements OnInit {

    private translate = inject(TranslateService);
    private navigation = inject(NavigationService);
    private snackbarService = inject(SnackbarMessageService);

    protected language = LanguageOption;
    protected selectedLanguage: LanguageOption = this.checkLanguageData();
    protected showLanguageList = false;
    protected infoRoutes: Route[] = [];
    protected connectRoutes: Route[] = [];
    protected creatorURL = 'https://yqni13.com';
    protected yearStamp = new Date().getFullYear().toString();
    protected socialmediaURL: Record<string, string> = {
        instagram: 'https://instagram.com/vargarella_',
        facebook: 'https://www.facebook.com/profile.php?id=61564886574397',
        publicartists: 'https://publicartists.online/artists/artcreation/',
        winstage: 'https://winstage.at/kunstler/daniela-varga/'
    };

    private isLocalStorageAvailable = typeof localStorage !== 'undefined';

    ngOnInit() {
        this.setLanguageData(this.selectedLanguage);
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
                document.querySelector('html')?.setAttribute('lang', language);
                return;
            }
        }
        
        document.querySelector('html')?.setAttribute('lang', 'de');
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

    clickOutside(event: any) {
        if(!event.target.className.includes('artdv-language-element')) {
            this.showLanguageList = false;
        }
    }
}