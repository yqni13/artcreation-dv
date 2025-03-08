/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { default as langEN } from "../../../../public/assets/i18n/en.json";
import { default as langDE } from "../../../../public/assets/i18n/de.json";
import { default as validLangEN } from "../../../../public/assets/i18n/validation-en.json";
import { default as validLangDE } from "../../../../public/assets/i18n/validation-de.json";

@Injectable({
    providedIn: 'root'
})
export class StaticTranslateService {

    private dataEN: any;
    private validEN: any;
    private dataDE: any;
    private validDE: any;

    constructor() {
        try {
            this.dataEN = langEN;
            this.validEN = validLangEN;
            this.dataDE = langDE;
            this.validDE = validLangDE
        } catch(err) {
            this.dataEN = {};
            this.validEN = {};
            this.dataDE = {};
            this.validDE = {};
            console.log(err);
        }
    }

    getTranslationEN(path: string): string {
        if(path === '' || path.includes('undefined')) {
            return '[TRANSLATION PATH NOT FOUND]';
        }

        return this.getTranslationByStringPath(path, this.dataEN);
    }

    getTranslationDE(path: string): string {
        if(path === '' || path.includes('undefined')) {
            return '[TRANSLATION PATH NOT FOUND]';
        }

        return this.getTranslationByStringPath(path, this.dataDE);
    }

    getValidationEN(path: string): string {
        if(path === '' || path.includes('undefined')) {
            return '[TRANSLATION PATH NOT FOUND]';
        }

        return this.getTranslationByStringPath(path, this.validEN);
    }

    getValidationDE(path: string): string {
        if(path === '' || path.includes('undefined')) {
            return '[TRANSLATION PATH NOT FOUND]';
        }

        return this.getTranslationByStringPath(path, this.validDE);
    }

    getTranslationByStringPath(path: string, dataLang: any): string {
        const accessKeys: string[] = [];
        let start = 0;
        
        // '.' is not a RegExp obj => needs 'g' flag to avoid TypeError
        [...path.matchAll(new RegExp('.', 'g'))].map(char => {
            if(char[0] === '.') {
                accessKeys.push(path.slice(start, char.index));
                start = char.index + 1;
            } else if (path.length-1 === char.index) {
                accessKeys.push(path.slice(start, char.index+1));
            }
        });
        const result = accessKeys.reduce((prev, curr) => prev?.[curr], dataLang);
        return result !== undefined ? result : 'TRANSLATION PATH INVALID';
    }

}