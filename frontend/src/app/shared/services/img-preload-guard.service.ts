import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, UrlTree } from "@angular/router";
import { ImgPreloadService } from "./img-preload.service";
import { catchError, from, map, Observable, of } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ImgPreloadGuard implements CanActivate {

    private readonly imgPreload = inject(ImgPreloadService);

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
        const images: string[] = route.data['preloadImages'] ?? [];
        if(images.length === 0) {
            return of(true);
        }

        return from(this.imgPreload.preloadMultiple(images)).pipe(
            map(() => true),
            catchError(() => of(true))
        );
    }
}