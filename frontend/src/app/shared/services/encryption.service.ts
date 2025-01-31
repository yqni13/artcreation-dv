import { Injectable } from "@angular/core";
import * as CryptoJS from 'crypto-js';
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class EncryptionService {

    private key: string;

    constructor() {
        this.key = environment.PRIVATE_DEV_KEY;
    }

    encryptData(data: any): string {
        return CryptoJS.AES.encrypt(data, this.key).toString();
    }

    decryptData(data: string): string {
        return CryptoJS.AES.decrypt(data, this.key).toString(CryptoJS.enc.Utf8);
    }
}