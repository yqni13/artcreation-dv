/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { NavigationStart, Route, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ThemeOption } from "../../../shared/enums/theme-option.enum";

@Component({
    selector: 'app-navigation',
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
    private mobileNavExpanded: boolean;
    private collapseNavbarWidth: number;
    private isLocalStorageAvailable: any;

    @Input() chosenTheme = '';

    constructor (
        private navigation: NavigationService,
        private router: Router,
    ) {
        this.isLocalStorageAvailable = typeof localStorage !== 'undefined';
        this.selectedTheme = this.checkLocalStorageTheme();
        this.setLocalStorageTheme(false, String(this.selectedTheme))

        router.events.subscribe(e => {
            if(e instanceof NavigationStart && typeof window !== 'undefined') {
                window.scrollTo(0,0);
            }
        })

        this.routes = [];
        this.mobileNavExpanded = false;
        this.collapseNavbarWidth = 768;
    }

    ngOnInit() {
        this.routes = this.getRoutes();
    }

    ngAfterViewInit() {
        // necessary to clean and newly add classes
        // in case of lightmode it would overwrite with both modes
        this.applyThemeClass();
    }

    private getRoutes(): Route[] {
        return this.navigation.getNavigationRoutes();
    }

    protected expandNavMobile(closeAfterNavigation = false) {
        if(closeAfterNavigation) {
            // TODO(yqni13): implement device detection
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
    }

    private applyThemeClass() {
        if(this.themeModeIcon) {
            this.themeModeIcon.nativeElement.classList.remove(ThemeOption.darkMode, ThemeOption.lightMode);
            this.themeModeIcon.nativeElement.classList.add(this.selectedTheme);
        }
    }
}