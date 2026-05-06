import { AfterViewInit, Component, ElementRef, OnInit,inject, viewChild } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { NavigationEnd, Route, Router, RouterEvent, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ThemeOption } from "../../../shared/enums/theme-option.enum";
import _ from 'underscore';
import { TranslateModule } from "@ngx-translate/core";
import { filter } from "rxjs";
import { AuthService } from "../../../shared/services/auth.service";
import { ThemeHandlerService } from "../../../shared/services/theme-handler.service";

@Component({
    selector: 'artdv-navigation',
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule
    ],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit, AfterViewInit {

    private readonly router = inject(Router);
    private readonly auth = inject(AuthService);
    private readonly navigation = inject(NavigationService);
    private readonly themeHandler = inject(ThemeHandlerService);

    private readonly themeModeIcon = viewChild<ElementRef>('themeModeIcon');

    protected routes: Route[] = [];
    protected selectedTheme: ThemeOption = this.themeHandler.checkThemeSettings();;
    protected isMobileMode = false;

    private maxMobileWidth = 1024;
    private window = document.defaultView;;

    constructor () {
        this.themeHandler.setThemeSettings(this.selectedTheme);
        this.router.events
        .pipe(filter(evt => evt instanceof NavigationEnd))
        .subscribe((event: RouterEvent) => {
            this.navigation.setPreviousUrl(this.navigation.getCurrentUrl());
            this.navigation.setCurrentUrl(event.url);
            this.redirectNotAuthRoute(event.url);
        });
    }

    ngOnInit() {
        this.routes = this.getRoutes();

        if(this.window?.screen !== undefined) {
            this.setNavWidthDynamically(this.window.screen.width);
            this.setNavWidthDynamically(document.body.clientWidth);        
        }

        // adapt to device screen resolution
        const screenWidthRequestSlowedDown = _.debounce( () => {
            if(this.window) {
                this.setNavWidthDynamically(this.window?.screen.width);
            }
        }, 250)
        this.window?.addEventListener("resize", screenWidthRequestSlowedDown, false);

        // adapt to zoom level
        const clientWidthRequestSlowedDown = _.debounce( () => {
            this.setNavWidthDynamically(document.body.clientWidth);
        }, 250)
        this.window?.addEventListener("resize", clientWidthRequestSlowedDown, false);
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
            document.body.setAttribute("data-nav", 'desktopMode');
            this.isMobileMode = false;
        } else {
            document.body.setAttribute("data-nav", 'mobileMode');
            this.isMobileMode = true;
        }
    }

    protected setTheme() {
        this.selectedTheme = this.themeHandler.switchTheme(this.selectedTheme);
    }

    private applyThemeClass() {
        if(this.themeModeIcon) {
            this.themeModeIcon()?.nativeElement.classList.remove(ThemeOption.darkMode, ThemeOption.lightMode);
            this.themeModeIcon()?.nativeElement.classList.add(this.selectedTheme);
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