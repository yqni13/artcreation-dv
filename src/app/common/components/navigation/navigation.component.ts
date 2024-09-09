/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { Route, RouterModule } from "@angular/router";
import { CommonModule, DOCUMENT } from "@angular/common";
import { ThemeOption } from "../../../shared/enums/theme-option.enum";
import _ from 'underscore';

@Component({
    selector: 'agal-navigation',
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss',
    standalone: true,
    imports: [
        CommonModule, 
        RouterModule
    ]
})
export class NavigationComponent implements OnInit, AfterViewInit {

    @ViewChild("themeModeIcon") themeModeIcon!: ElementRef;
    
    protected routes: Route[];
    protected selectedTheme: ThemeOption;
    protected isMobileMode: boolean;

    private maxMobileWidth: number;
    private window: any;
    private isLocalStorageAvailable: any;

    constructor (
        @Inject(DOCUMENT) private document: Document,
        private navigation: NavigationService,
    ) {
        this.isLocalStorageAvailable = typeof localStorage !== 'undefined';
        this.selectedTheme = this.checkLocalStorageTheme();
        this.setLocalStorageTheme(false, String(this.selectedTheme))
        this.window = this.document.defaultView;
        this.maxMobileWidth = 1024;

        this.routes = [];
        this.isMobileMode = false;
    }

    ngOnInit() {
        this.routes = this.getRoutes();

        if(this.window.screen !== undefined) {
            this.setNavWidthDynamically(this.window.screen.width);
            this.setNavWidthDynamically(this.document.body.clientWidth);        
        }

        // adapt to device screen resolution
        const screenWidthRequestSlowedDown = _.debounce( () => {
            this.setNavWidthDynamically(this.window.screen.width);
        }, 250)
        this.window.addEventListener("resize", screenWidthRequestSlowedDown, false);
        
        // adapt to zoom level
        const clientWidthRequestSlowedDown = _.debounce( () => {
            this.setNavWidthDynamically(this.document.body.clientWidth);
        }, 250)
        this.window.addEventListener("resize", clientWidthRequestSlowedDown, false);
    }
    
    ngAfterViewInit() {
        // necessary to clean and newly add classes
        // in case of lightmode it would overwrite with both modes
        this.applyThemeClass();
    }

    private getRoutes(): Route[] {
        return this.navigation.getNavigationRoutes();
    }

    private setNavWidthDynamically(width: number): void {
        // sets data attribute for body and in media.scss style settings are applied
        if(width > this.maxMobileWidth) {
            this.document.body.setAttribute("data-nav", 'navDesktop');
            this.isMobileMode = false;
        } else {
            this.document.body.setAttribute("data-nav", 'mobileMode');
            this.isMobileMode = true;
        }
    }

    protected setTheme() {
        if(this.isLocalStorageAvailable) {
            if (this.selectedTheme === ThemeOption.darkMode) {
                this.selectedTheme = ThemeOption.lightMode;
            } else {
                this.selectedTheme = ThemeOption.darkMode
            }

            this.setLocalStorageTheme(false, String(this.selectedTheme));
            return;
        }

        this.selectedTheme = ThemeOption.darkMode;
    }

    private checkLocalStorageTheme(): ThemeOption {
        if(this.isLocalStorageAvailable) {
            const theme = localStorage.getItem('agal-theme');

            if(!theme) {
                this.setLocalStorageTheme(true);
                return ThemeOption.darkMode;
            }

            return String(theme) === 'light' ? ThemeOption.lightMode : ThemeOption.darkMode;
        }
        
        this.setLocalStorageTheme(true);
        return ThemeOption.darkMode;
    }

    private setLocalStorageTheme(forceSelection: boolean, theme?: string) {
        if(this.isLocalStorageAvailable) {
            if(forceSelection || theme === ThemeOption.darkMode) {
                localStorage.setItem("agal-theme", 'dark');
                document.body.setAttribute("data-theme", 'dark');
                return;
            }

            if(theme === ThemeOption.lightMode) {
                localStorage.setItem("agal-theme", 'light');
                document.body.setAttribute("data-theme", 'light');
                return;
            }
        }
        // TODO(yqni13): implement handling if localstorage is not available (block change of theme or save later)
    }

    private applyThemeClass() {
        if(this.themeModeIcon) {
            this.themeModeIcon.nativeElement.classList.remove(ThemeOption.darkMode, ThemeOption.lightMode);
            this.themeModeIcon.nativeElement.classList.add(this.selectedTheme);
        }
    }
}