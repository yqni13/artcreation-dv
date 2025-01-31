import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { AuthResponse } from "../interfaces/auth.interface";
import { EncryptionService } from "./encryption.service";
import { TokenService } from "./token.service";
import { TokenOptions } from "../enums/token-options.enum";
import { DateTimeService } from "./datetime.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    protected msg: string;

    private isAuthenticated: boolean;
    private redirectUrl: string | null;
    private authToken: string | null;
    private siteKey: string;
    private secretKey: string;

    private readonly TOKEN_KEY: string;
    private readonly USER_DATA_KEY: string;
    private readonly SESSION_EXPIRE_KEY: string;
    private readonly SESSION_DURATION: number;

    protected urlLoginAPI: string;
    protected urlLogoutAPI: string;

    constructor(
        private readonly http: HttpClient,
        private readonly token: TokenService,
        private readonly datetime: DateTimeService,
        private readonly encrypt: EncryptionService,
    ) {
        this.msg = '';

        this.isAuthenticated = false;
        this.redirectUrl = null;
        this.authToken = null;
        this.siteKey = '';
        this.secretKey = '';

        this.TOKEN_KEY = 'tokenData';
        this.USER_DATA_KEY = 'userData';
        this.SESSION_EXPIRE_KEY = 'sessionExpireData';
        this.SESSION_DURATION = 24 * 60 * 60 * 1000;

        this.urlLoginAPI = environment.API_BASE_URL + '/api/v1/auth/login'
        this.urlLogoutAPI = environment.API_BASE_URL + '/api/v1/auth/logout'
    }

    login(user: string, pass: string): Observable<any> {
        const encryptedPass = this.encrypt.encryptData(pass);
        return this.http.post<any>(this.urlLoginAPI, { user: user, pass: encryptedPass }, { observe: 'response' })
            .pipe(
                tap(response => {
                    this.setSession(response.body?.body);
                })
            )
    }

    logout() {
        this.token.removeToken(TokenOptions.session_id);
        this.token.removeToken(TokenOptions.session_expiration);
    }

    private setSession(authResponse: AuthResponse) {
        this.token.removeToken(TokenOptions.session_id);
        this.token.removeToken(TokenOptions.session_expiration);
        const expiration = this.datetime.addTimestampWithCurrentMoment(
            this.datetime.getTimeInMillisecondsFromHours(authResponse.expiresIn)
        );
        
        this.token.setToken(TokenOptions.session_id, authResponse.token);
        this.token.setToken(TokenOptions.session_expiration, JSON.stringify(expiration));
    }

    isLoggedIn(): boolean {
        const hasSessionToken = this.token.getToken(TokenOptions.session_id) !== null ? true : false;
        return hasSessionToken && (this.getExpiration() - Date.now()) > 0 ? true : false;
    }

    // use to automatically renew token?
    getExpiration() {
        const expirationToken = this.token.getToken(TokenOptions.session_expiration) as unknown;
        return expirationToken as number;
    }
}