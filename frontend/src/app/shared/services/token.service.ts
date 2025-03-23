import { Injectable } from "@angular/core";
import { TokenOption } from "../enums/token-option.enum";

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    private identifier: string;

    constructor() {
        this.identifier = 'artcreation-dv_';
    }

    setToken(key: TokenOption, token: string) {
        sessionStorage.setItem(this.identifier + key, token);
    }

    getToken(key: TokenOption): string | null {
        return sessionStorage.getItem(this.identifier + key);
    }

    removeToken(key: TokenOption) {
        sessionStorage.removeItem(this.identifier + key);
    }

    clearSession() {
        sessionStorage.clear();
    }
}