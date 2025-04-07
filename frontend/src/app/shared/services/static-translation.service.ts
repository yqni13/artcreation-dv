/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { default as langEN } from "../../../../public/assets/i18n/en.json";
import { default as langDE } from "../../../../public/assets/i18n/de.json";
import { default as validLangEN } from "../../../../public/assets/i18n/validation-en.json";
import { default as validLangDE } from "../../../../public/assets/i18n/validation-de.json";
import { TranslateService } from "@ngx-translate/core";
import { SnackbarInput } from "../enums/snackbar-input.enum";

@Injectable({
    providedIn: 'root'
})
export class StaticTranslateService {

    private dataEN: any;
    private validEN: any;
    private dataDE: any;
    private validDE: any;

    constructor(private readonly translate: TranslateService) {
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

    getValidationEN(path: string, mode: SnackbarInput, params?: any): string {
        if(path === '' || path.includes('undefined')) {
            return mode === SnackbarInput.TITLE ? this.getDefaultExceptionTitle() : this.getDefaultExceptionText();
        }

        return this.getTranslationByStringPath(path, this.validEN, mode, params || null);
    }

    getValidationDE(path: string, mode: SnackbarInput, params?: any): string {
        if(path === '' || path.includes('undefined')) {
            return mode === SnackbarInput.TITLE ? this.getDefaultExceptionTitle() : this.getDefaultExceptionText();
        }

        return this.getTranslationByStringPath(path, this.validDE, mode, params || null);
    }

    private getTranslationByStringPath(path: string, dataLang: any, mode?: SnackbarInput, params?: any): string {
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
        let result = accessKeys.reduce((prev, curr) => prev?.[curr], dataLang);
        if(params && params.val && result.includes('{{VAL}}')){
            result = result.replace('{{VAL}}', params.val);
        }
        if(params && params.len && result.includes('{{LENGTH}}')) {
            result = result.replace('{{LENGTH}}', params.len);
        }
        if(params && params.min && result.includes('{{MIN}}')) {
            result = result.replace('{{MIN}}', params.min);
        }
        if(params && params.max && result.includes('{{MAX}}')) {
            result = result.replace('{{MAX}}', params.max);
        }
        let unknownTranslation = '';
        if(result === undefined && mode !== undefined) {
            unknownTranslation = mode === SnackbarInput.TITLE 
                ? this.getDefaultExceptionTitle() 
                : this.getDefaultExceptionText();
        }
        return result !== undefined ? result : unknownTranslation;
    }

    private getDefaultExceptionTitle(): string {
        return this.translate.instant('validation.backend.header.UnknownException');
    }

    private getDefaultExceptionText(): string {
        return this.translate.instant('validation.backend.data.unknown-error');
    }
}