/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { ContactMailItem } from "../interfaces/ContactMailItems";
import { SubjectOptions } from "../enums/contact-subject.enum";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn: 'root',
})
export class MailService {

    private mailData: any;
    private url: string;

    constructor(private http: HttpClient) {
        this.mailData = {}

        // TODO(yqni13): clean input before use

        // endpoint backend (server-custom.js)
        this.url = 'http://localhost:3000/send-email';
    }

    setMailData(data: ContactMailItem) {
        this.mailData = data;
    }

    private configMailData() {
        this.mailData.subject = this.mailData.subject === SubjectOptions.artOrder 
        ? `${this.mailData.subject}: ${this.mailData.referenceNr}`
        : this.mailData.subject;

        this.mailData.message = `
            This email was sent by: ${this.mailData.firstName} ${this.mailData.lastName}\n
            Reference-Number: ${this.mailData.referenceNr.length > 0 
                ? this.mailData.referenceNr 
                : '--'}\n\n
            Message: ${this.mailData.message}
        `
    }

    sendMail() {
        this.configMailData();
        return this.http.post(this.url, this.mailData, {responseType: 'text'});        
    }
}