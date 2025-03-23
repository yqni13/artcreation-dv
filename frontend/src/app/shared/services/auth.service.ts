import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { AuthResponse } from "../interfaces/auth.interface";
import { EncryptionService } from "./encryption.service";
import { TokenService } from "./token.service";
import { TokenOption } from "../enums/token-option.enum";
import { DateTimeService } from "./datetime.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    protected urlLoginAPI: string;
    protected exceptionList: string[];

    private credentials: any;

    constructor(
        private readonly http: HttpClient,
        private readonly token: TokenService,
        private readonly datetime: DateTimeService,
        private readonly encrypt: EncryptionService,
    ) {
        this.urlLoginAPI = environment.API_BASE_URL + '/api/v1/auth/login';
        this.exceptionList = [
            'JWTExpirationException',
            'TokenMissingException',
            'InvalidCredentialsException',
            'InternalServerException',
            'InvalidPropertiesException',
            'AuthSecretNotFoundException',
            'RequestExceedMaxException',
            'UnexpectedApiResponseException'
        ];
        this.credentials = {
            user: '',
            pass: ''
        };
    }

    getExceptionList(): string[] {
        return this.exceptionList;
    }

    async setCredentials(user: string, pass: string) {
        this.credentials = {
            user: user,
            pass: await this.encrypt.encryptRSA(pass)
        }
    }

    login(): Observable<HttpResponse<any>> {
        this.logout();
        return this.http.post<any>(this.urlLoginAPI, this.credentials, { observe: 'response' })
            .pipe(
                tap(response => {
                    this.setSession(response.body?.body);
                })
            )
    }

    logout() {
        this.token.removeToken(TokenOption.TOKEN);
        this.token.removeToken(TokenOption.EXPIRATION);
    }

    private setSession(authResponse: AuthResponse) {
        this.token.removeToken(TokenOption.TOKEN);
        this.token.removeToken(TokenOption.EXPIRATION);
        const expiration = this.datetime.addTimestampWithCurrentMoment(
            this.datetime.getTimeInMillisecondsFromExpiration(authResponse.expiresIn)
        );
        
        this.token.setToken(TokenOption.TOKEN, authResponse.token.body.token);
        this.token.setToken(TokenOption.EXPIRATION, JSON.stringify(expiration));
    }

    isLoggedIn(): boolean {
        const hasSessionToken = this.token.getToken(TokenOption.TOKEN) !== null ? true : false;
        if(hasSessionToken && (this.getExpiration() - Date.now()) > 0) {
            return true;
        }
        this.logout();
        return false;
    }

    // use to automatically renew token?
    getExpiration() {
        const expirationToken = this.token.getToken(TokenOption.EXPIRATION) as unknown;
        return expirationToken as number;
    }
}