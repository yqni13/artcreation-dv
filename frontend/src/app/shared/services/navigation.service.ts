import { inject, Injectable } from "@angular/core";
import { Route, Router } from "@angular/router";

@Injectable({
    providedIn: 'root',
})
export class NavigationService {

    private readonly router = inject(Router);

    private currentUrl = '';
    private previousUrl = '';

    setCurrentUrl(url: string) {
        if(url.length < 1) {
            this.currentUrl = 'UNAVAILABLE';
            return;
        }

        this.currentUrl = url;
    }

    getCurrentUrl(): string {
        return this.currentUrl;
    }

    setPreviousUrl(url: string) {
        if(url.length < 1) {
            this.previousUrl = 'UNAVAILABLE';
            return;
        }

        this.previousUrl = url;
    }

    getPreviousUrl(): string {
        return this.previousUrl;
    }

    getNavigationRoutes(): Route[] {
        return this.router.config
            .flatMap((route: Route) => [route, ...(route.children || [])])
            .filter((route: Route) => route.data?.["showInNavbar"]);
    }

    getFooterConnectRoutes(): Route[] {
        return this.router.config
            .flatMap((route: Route) => [route, ...(route.children || [])])
            .filter((route: Route) => route.data?.["showInFooterConnect"]);
    }

    getFooterInfoRoutes(): Route[] {
        return this.router.config
            .flatMap((route: Route) => [route, ...(route.children || [])])
            .filter((route: Route) => route.data?.["showInFooterInfo"]);
    }

    scrollToTop(scrollAnchor: HTMLElement, document: Document) {
        if(scrollAnchor && document.scrollingElement !== null) {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            HTMLElement.prototype.scrollTo = () => {};
            scrollAnchor.scrollTo(0,0);
            // Need to kill the y-offset caused by navbar in mobile mode.
            document.scrollingElement.scrollTop = 0;
        }
    }
}