/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { ContactFormItem } from "../interfaces/ContactMailItems";
import { SubjectOptions } from "../enums/contact-subject.enum";
import { HttpClient } from "@angular/common/http";
import { ArtworkOptions } from "../enums/artwork-option.enum";
import { environment } from "../../../environments/environment";


@Injectable({
    providedIn: 'root',
})
export class MailService {

    private mailData: ContactFormItem;
    private url: string;

    constructor(private http: HttpClient) {
        this.mailData = {
            subject: '',
            referenceNr: '',
            to: '',
            honorifics: '',
            title: '',
            firstName: '',
            lastName: '',
            price: '',
            type: '',
            body: ''
        }
        // TODO(yqni13): clean input before use

        // endpoint backend (server-custom.js)
        this.url = environment.API_BASE_URL + '/send-email';
    }

    setMailData(data: any) {
        this.mailData = {
            subject: data.subject,
            referenceNr: data.referenceNr,
            to: data.email,
            honorifics: data.honorifics,
            title: data.title,
            firstName: data.firstName,
            lastName: data.lastName,
            price: data.price,
            type: data.type,
            body: data.message
        };
    }

    private configMailData() {
        this.mailData.subject = this.mailData.subject === SubjectOptions.artOrder 
        ? `${this.mailData.subject}: ${this.mailData.referenceNr}`
        : this.mailData.subject;

        const msgPartType = this.mailData.type === ArtworkOptions.originalORprint
            ? `${ArtworkOptions.original} & ${ArtworkOptions.print}`
            : this.mailData.type;

        const msgTitle = this.mailData.title !== ''
            ? `${this.mailData.title} `
            : ''

        const msgArtworkData = (this.mailData.referenceNr === undefined || this.mailData.referenceNr?.length > 0)
            ? this.mailData.referenceNr?.toUpperCase() + `\nType: ${msgPartType}`
            : `--`

        this.mailData.body = `This email was sent by: ${this.mailData.honorifics} ${msgTitle}${this.mailData.firstName} ${this.mailData.lastName}\nReference-Number: ${msgArtworkData}\n\nMessage: ${this.mailData.body}`
    }

    sendMail() {
        this.configMailData();
        return this.http.post(this.url, this.mailData, { observe: 'response' });        
    }
}