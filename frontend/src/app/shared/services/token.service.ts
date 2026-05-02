import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { TokenOption } from "../enums/token-option.enum";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    private identifier: string;
    private readonly platformId = inject(PLATFORM_ID);

    constructor() {
        this.identifier = 'artcreation-dv_';
    }

    setToken(key: TokenOption, token: string) {
        if(this.checkSessionStorage()) {
            sessionStorage.setItem(this.identifier + key, token);
        }
    }

    getToken(key: TokenOption): string | null {
        return this.checkSessionStorage() ? sessionStorage.getItem(this.identifier + key) : null;
    }

    removeToken(key: TokenOption) {
        if(this.checkSessionStorage()) {
            sessionStorage.removeItem(this.identifier + key);
        }
    }

    clearSession() {
        if(this.checkSessionStorage()) {
            sessionStorage.clear();
        }
    }

    private checkSessionStorage(): boolean {
        return isPlatformBrowser(this.platformId) ? true : false;
    }
}