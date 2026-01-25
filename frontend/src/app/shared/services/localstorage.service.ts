import { Injectable } from "@angular/core";
import { LocalStorageValue } from "../interfaces/localstorage.interface";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    private isLocalStorageAvailable: any;
    private identifier: string;

    constructor() {
        this.isLocalStorageAvailable = typeof localStorage !== 'undefined';
        this.identifier = 'artcreation-dv_';
    }

    setItem(keyID: string, value: string) {
        const expiration = new Date();
        expiration.setHours(23, 59, 59, 999);

        const payload: LocalStorageValue<string> = {
            content: value,
            expiresAt: expiration.toISOString()
        };

        if(this.isLocalStorageAvailable) {
            localStorage.setItem(`${this.identifier}${keyID}`, JSON.stringify(payload));
        }
    }

    getItem(keyID: string): string | null {
        let rawItem = null;
        const key = `${this.identifier}${keyID}`;
        if(this.isLocalStorageAvailable) {
            rawItem = localStorage.getItem(key);
        }
        if(!rawItem) {
            return null;
        }
        try {
            const parsedItem = JSON.parse(rawItem) as LocalStorageValue<string>;
            if(new Date(parsedItem.expiresAt) < new Date()) {
                this.removeItem(key);
                return null;
            }

            return parsedItem.content;
        } catch {
            this.removeItem(key);
            return null;
        }
    }

    removeItem(key: string, hasPrefix: boolean = true) {
        if(this.isLocalStorageAvailable) {
            key = hasPrefix ? key : this.identifier+key;
            localStorage.removeItem(key);
        }
    }
}