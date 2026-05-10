import { Injectable } from "@angular/core";
import { LocalStorageValue } from "../interfaces/localstorage.interface";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    private isLocalStorageAvailable = typeof localStorage !== 'undefined';
    private prefix = 'artcreation-dv_';

    setItem<T>(postfix: string, value: T) {
        const expiration = new Date();
        expiration.setHours(23, 59, 59, 999);

        const payload: LocalStorageValue<T> = {
            content: value,
            expiresAt: expiration.toISOString()
        };

        if(this.isLocalStorageAvailable) {
            const key = `${this.prefix}${postfix}`;
            localStorage.setItem(key, JSON.stringify(payload));
        }
    }

    getItem<T>(postfix: string): T | null {
        let rawItem: string | null = null;
        const key = `${this.prefix}${postfix}`;
        if(this.isLocalStorageAvailable) {
            rawItem = localStorage.getItem(key);
        }
        if(!rawItem) {
            return null;
        }
        try {
            const parsedItem = JSON.parse(rawItem) as LocalStorageValue<T>;
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

    removeItem(postfix: string, hasPrefix = true) {
        if(this.isLocalStorageAvailable) {
            const key = hasPrefix ? postfix : this.prefix+postfix;
            localStorage.removeItem(key);
        }
    }
}