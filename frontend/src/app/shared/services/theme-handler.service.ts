/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { ThemeOption } from "../enums/theme-option.enum";
import { ThemeObservationService } from "./theme-observation.service";

@Injectable({
    providedIn: 'root',
})
export class ThemeHandlerService {

    private isLocalStorageAvailable: any;
    private identifier: string;
    private themeAttribute: string;
    
    constructor(
        @Inject(DOCUMENT) private document: Document,
        private readonly themeObserve: ThemeObservationService
    ) {
        this.isLocalStorageAvailable = typeof localStorage !== 'undefined';
        this.identifier = 'artcreation-dv.at-theme';
        this.themeAttribute = 'data-theme';
    }

    checkThemeSettings(): ThemeOption {
        if(this.isLocalStorageAvailable) {
            const theme = localStorage.getItem(this.identifier);
            if(!theme) {
                return ThemeOption.darkMode;
            }

            return String(theme) === 'lightMode' ? ThemeOption.lightMode : ThemeOption.darkMode;
        }

        return ThemeOption.darkMode;
    }

    setThemeSettings(theme: ThemeOption) {
        if(this.isLocalStorageAvailable) {
            if(theme) {
                localStorage.setItem(this.identifier, theme);
                this.document.body.setAttribute(this.themeAttribute, theme);
                this.themeObserve.setThemeOption(theme);
                return;
            }
        }
        
        this.themeObserve.setThemeOption(ThemeOption.darkMode);
        this.document.body.setAttribute(this.themeAttribute, 'darkMode');
    }

    switchTheme(theme: ThemeOption): ThemeOption {
        if(this.isLocalStorageAvailable) {
            if (theme === ThemeOption.darkMode) {
                theme = ThemeOption.lightMode;
            } else {
                theme = ThemeOption.darkMode
            }

            this.setThemeSettings(theme);
            return theme;
        }

        this.setThemeSettings(ThemeOption.darkMode);
        return ThemeOption.darkMode;
    }
}