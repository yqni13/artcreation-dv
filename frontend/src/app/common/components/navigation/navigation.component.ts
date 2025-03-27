/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { NavigationEnd, Route, Router, RouterModule } from "@angular/router";
import { CommonModule, DOCUMENT } from "@angular/common";
import { ThemeOption } from "../../../shared/enums/theme-option.enum";
import _ from 'underscore';
import { TranslateModule } from "@ngx-translate/core";
import { filter } from "rxjs";
import { AuthService } from "../../../shared/services/auth.service";
import { ThemeHandlerService } from "../../../shared/services/theme-handler.service";

@Component({
    selector: 'artdv-navigation',
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss',
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule
    ]
})
export class NavigationComponent implements OnInit, AfterViewInit {

    @ViewChild("themeModeIcon") themeModeIcon!: ElementRef;
    
    protected routes: Route[];
    protected selectedTheme: ThemeOption;
    protected isMobileMode: boolean;

    private maxMobileWidth: number;
    private window: any;

    constructor (
        private readonly router: Router,
        private readonly auth: AuthService,
        @Inject(DOCUMENT) private document: Document,
        private readonly navigation: NavigationService,
        private readonly themeHandler: ThemeHandlerService
    ) {
        this.selectedTheme = this.themeHandler.checkThemeSettings();
        this.themeHandler.setThemeSettings(this.selectedTheme);

        this.window = this.document.defaultView;
        this.maxMobileWidth = 1024;
        this.routes = [];
        this.isMobileMode = false;

        this.router.events
        .pipe(filter(evt => evt instanceof NavigationEnd))
        .subscribe((event: any) => {
            this.navigation.setPreviousUrl(this.navigation.getCurrentUrl());
            this.navigation.setCurrentUrl(event.url);
            this.redirectNotAuthRoute(event.url);
        })
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
            this.document.body.setAttribute("data-nav", 'desktopMode');
            this.isMobileMode = false;
        } else {
            this.document.body.setAttribute("data-nav", 'mobileMode');
            this.isMobileMode = true;
        }
    }

    protected setTheme() {
        this.selectedTheme = this.themeHandler.switchTheme(this.selectedTheme);
    }

    private applyThemeClass() {
        if(this.themeModeIcon) {
            this.themeModeIcon.nativeElement.classList.remove(ThemeOption.darkMode, ThemeOption.lightMode);
            this.themeModeIcon.nativeElement.classList.add(this.selectedTheme);
        }
    }

    authRoute(auth: boolean | null): boolean {
        if(!auth || (auth && this.auth.isLoggedIn())) {
            return true;
        }
        return false;
    }

    redirectNotAuthRoute(url: string) {
        if(this.auth.isLoggedIn() && url === '/login') {
            this.router.navigate(['admin']);
        }
        if(!this.auth.isLoggedIn() && url === '/admin') {
            this.router.navigate(['login']);
        }
    }
}