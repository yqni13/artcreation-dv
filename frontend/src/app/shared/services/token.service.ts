import { Injectable } from "@angular/core";
import { TokenOptions } from "../enums/token-options.enum";

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    setToken(key: TokenOptions, token: string) {
        sessionStorage.setItem('artcreation-dv_' + key, token);
    }

    getToken(key: TokenOptions): string | null {
        return sessionStorage.getItem('artcreation-dv_' + key);
    }

    removeToken(key: TokenOptions) {
        sessionStorage.removeItem('artcreation-dv_' + key);
    }

    clearSession() {
        sessionStorage.clear();
    }
}