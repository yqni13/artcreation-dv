import { Injectable } from "@angular/core";
import { SnackbarMessage } from "../interfaces/SnackbarMessage";
import { SnackbarOption } from "../enums/snackbar-option.enum";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SnackbarMessageService {

    snackbarCollection: SnackbarMessage[];
    subject: Subject<boolean>;

    constructor() {
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

    close(snackbar: SnackbarMessage) {
        const displayedSnackbarIndex = this.snackbarCollection.indexOf(snackbar);
        if(displayedSnackbarIndex !== -1) {
            this.snackbarCollection.splice(displayedSnackbarIndex, 1);
        }
    } 
}