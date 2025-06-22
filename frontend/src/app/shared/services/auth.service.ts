import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { AuthResponse } from "../interfaces/auth.interface";
import { EncryptionService } from "./encryption.service";
import { TokenService } from "./token.service";
import { TokenOption } from "../enums/token-option.enum";
import { Router } from "@angular/router";
import { BaseRoute } from "../../api/routes/base.route.enum";
import { SnackbarMessageService } from "./snackbar.service";
import { TranslateService } from "@ngx-translate/core";
import { StaticTranslateService } from "./static-translation.service";
import { SnackbarOption } from "../enums/snackbar-option.enum";
import { SnackbarInput } from "../enums/snackbar-input.enum";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    protected exceptionList: string[];
    
    private urlPreConnect: string;
    private urlLoginAPI: string;
    private preConnection: boolean;
    private credentials: any;
    private logoutTimer: ReturnType<typeof setTimeout> | null;

    constructor(
        private readonly router: Router,
        private readonly http: HttpClient,
        private readonly token: TokenService,
        private readonly encrypt: EncryptionService,
        private readonly translate: TranslateService,
        private readonly snackbar: SnackbarMessageService,
        private readonly staticTranslate: StaticTranslateService
    ) {
        this.exceptionList = [
            'JWTExpirationException',
            'TokenMissingException',
            'InvalidCredentialsException',
            'InternalServerException',
            'InvalidPropertiesException',
            'AuthSecretNotFoundException',
            'RequestExceedMaxException',
            'UnexpectedApiResponseException',
            'AuthenticationException'
        ];
        
        this.urlPreConnect = environment.API_BASE_URL + '/api/v1/auth/pre-connect';
        this.urlLoginAPI = environment.API_BASE_URL + '/api/v1/auth/login';
        this.preConnection = false;
        this.credentials = {
            user: '',
            pass: ''
        };
        this.logoutTimer = null;
    }

    getExceptionList(): string[] {
        return this.exceptionList;
    }

    getPreConnectionStatus(): boolean {
        return this.preConnection;
    }

    async setCredentials(user: string, pass: string) {
        this.credentials = {
            user: user,
            pass: await this.encrypt.encryptRSA(pass)
        }
    }

    preConnect(): Observable<HttpResponse<any>> {
        return this.http.get<any>(this.urlPreConnect, {observe: 'response'}).pipe(
            tap(response => {
                this.preConnection = response.body?.body.connection;
            })
        )
    }

    login(): Observable<HttpResponse<any>> {
        this.logout(false);
        return this.http.post<any>(this.urlLoginAPI, this.credentials, { observe: 'response' }).pipe(
            tap(response => {
                this.setSession(response.body?.body);
                this.setExpirationTimer(this.token.getToken(TokenOption.TOKEN) ?? '')
            })
        )
    }

    logout(nav2Login: boolean = true) {
        this.token.removeToken(TokenOption.TOKEN);
        this.token.removeToken(TokenOption.EXPIRATION);

        if(this.logoutTimer) {
            clearTimeout(this.logoutTimer);
            this.logoutTimer = null;
        }
        if(nav2Login) {
            this.router.navigate([BaseRoute.LOGIN]);
        }
    }

    private setSession(authResponse: AuthResponse) {
        this.token.removeToken(TokenOption.TOKEN);
        this.token.removeToken(TokenOption.EXPIRATION);

        const token = authResponse.token.body.token;
        const expiration = JSON.parse(atob(token.split('.')[1])).exp * 1000;

        this.token.setToken(TokenOption.TOKEN, token);
        this.token.setToken(TokenOption.EXPIRATION, JSON.stringify(expiration));
    }

    isLoggedIn(): boolean {
        const hasSessionToken = this.token.getToken(TokenOption.TOKEN) !== null ? true : false;
        if(hasSessionToken && (this.getExpiration() - Date.now()) > 0) {
            return true;
        }
        this.logout(false);
        return false;
    }

    // use to automatically renew token?
    getExpiration() {
        const expirationToken = this.token.getToken(TokenOption.EXPIRATION) as unknown;
        return expirationToken as number;
    }

    setExpirationTimer(token: string) {
        if(token === '') {
            return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        const expInSeconds = payload.exp * 1000;
        const timeout = expInSeconds - Date.now();

        if(timeout <= 0) {
            this.logout();
            this.#notifyOnAutoLogout();
        } else {
            this.logoutTimer = setTimeout(() => {
                this.logout();
                this.#notifyOnAutoLogout();
            }, timeout);
        }
    }

    restoreExpirationTimer() {
        const token = this.token.getToken(TokenOption.TOKEN);
        if(token) {
            this.setExpirationTimer(token);
        }
    }

    #notifyOnAutoLogout() {
        const titlePath = 'validation.backend.header.JWTExpirationException';
        const textPath = 'validation.frontend.other.auto-logout';
        this.snackbar.notify({
            title: this.translate.currentLang === 'de'
                ? this.staticTranslate.getValidationDE(titlePath, SnackbarInput.TITLE)
                : this.staticTranslate.getValidationEN(titlePath, SnackbarInput.TITLE),
            text: this.translate.currentLang === 'de'
                ? this.staticTranslate.getValidationDE(textPath, SnackbarInput.TEXT)
                : this.staticTranslate.getValidationEN(textPath, SnackbarInput.TEXT),
            autoClose: true,
            type: SnackbarOption.info,
            displayTime: 6000
        })
    }
}