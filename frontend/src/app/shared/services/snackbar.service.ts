import { Injectable } from "@angular/core";
import { SnackbarMessage, SnackbarParameter } from "../interfaces/SnackbarMessage";
import { SnackbarOption } from "../enums/snackbar-option.enum";
import { Subject } from "rxjs";
import { StaticTranslateService } from "./static-translation.service";
import { SnackbarInput } from "../enums/snackbar-input.enum";

@Injectable({
    providedIn: 'root'
})
export class SnackbarMessageService {

    snackbarCollection: SnackbarMessage[];
    subject: Subject<boolean>;

    constructor(private readonly staticTranslate: StaticTranslateService) {
        this.snackbarCollection = [];
        this.subject = new Subject<boolean>();
    }

    onNotify() {
        this.subject.next(true);
    }

    notify(snackbar: SnackbarMessage) {
        snackbar.type = snackbar.type || SnackbarOption.info;

        if(snackbar.title.length === 0) {
            snackbar.title = 'No title selected.'
        }

        if(!snackbar.autoClose) {
            snackbar.displayTime = 0;
        }

        if(snackbar.displayTime === undefined || snackbar.displayTime === 0) {
            snackbar.displayTime = 3000;
        }

        if(snackbar.autoClose) {
            snackbar.displayHandler = setTimeout(() => this.close(snackbar), snackbar.displayTime);
        }

        this.snackbarCollection.push(snackbar);
    }

    notifyOnInterceptorError(response: any, lang: string, message: string, closeMode: boolean, closeTime?: number) {        
        const path = 'validation.backend';
        const error = response.error.headers.error;
        const params: SnackbarParameter = {
            val: null,
            len: null,
            min: null,
            max: null
        };
    
        // check for parameter, assign values and adapt validation message
        if(message.includes('!')) {
            const substring = message.substring(message.indexOf('!'), message.length);
            message = message.replace(substring, '');
            params.max = substring.replace('!', '');
        }
        if(message.includes('?')) {
            const substring = message.substring(message.indexOf('?'), message.length);
            message = message.replace(substring, '');
            params.min = substring.replace('?', '');
        }
        if(message.includes('$')) {
            const substring = message.substring(message.indexOf('$'), message.length);
            message = message.replace(substring, '');
            params.len = substring.replace('$', '');
        }
        if(message.includes('#')) {
            const substring = message.substring(message.indexOf('#'), message.length);
            message = message.replace(substring, '');
            params.val = substring.replace('#', '');
        }
    
        // display backend validation in UI
        this.notify({
            title: lang === 'en'
                ? this.staticTranslate.getValidationEN(`${path}.header.${error}`, SnackbarInput.TITLE)
                : this.staticTranslate.getValidationDE(`${path}.header.${error}`, SnackbarInput.TITLE),
            text: lang === 'en'
                ? this.staticTranslate.getValidationEN(`${path}.data.${message}`, SnackbarInput.TEXT, params.val ? params : null)
                : this.staticTranslate.getValidationDE(`${path}.data.${message}`, SnackbarInput.TEXT, params.val ? params : null),
            autoClose: closeMode,
            type: SnackbarOption.error,
            displayTime: closeTime
        })
    }

    notifyOnInterceptorSuccess(path: string, lang: string, closeAuto: boolean, closeTimer?: number) {
        this.notify({
            title: lang === 'en'
                ? this.staticTranslate.getValidationEN(path, SnackbarInput.TITLE)
                : this.staticTranslate.getValidationDE(path, SnackbarInput.TITLE),
            text: '',
            autoClose: closeAuto,
            type: SnackbarOption.success,
            displayTime: closeTimer
        })
    }

    close(snackbar: SnackbarMessage) {
        const displayedSnackbarIndex = this.snackbarCollection.indexOf(snackbar);
        if(displayedSnackbarIndex !== -1) {
            this.snackbarCollection.splice(displayedSnackbarIndex, 1);
        }
    } 
}