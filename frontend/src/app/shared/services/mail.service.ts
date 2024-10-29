/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { ContactMailItem } from "../interfaces/ContactMailItems";
import { SubjectOptions } from "../enums/contact-subject.enum";
import { HttpClient } from "@angular/common/http";
import { ArtworkOptions } from "../enums/artwork-option.enum";
import { environment } from "../../../environments/environment";


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
        this.url = environment.API_BASE_URL + '/send-email';
    }

    setMailData(data: ContactMailItem) {
        this.mailData = data;
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

        const msgArtworkData = this.mailData.referenceNr.length > 0
            ? this.mailData.referenceNr.toUpperCase() + `, Type: ${msgPartType}`
            : `--`

        this.mailData.message = `
            This email was sent by: ${this.mailData.honorifics} ${msgTitle}${this.mailData.firstName} ${this.mailData.lastName}\n
            Reference-Number: ${msgArtworkData}\n\n
            Message: ${this.mailData.message}
        `
    }

    sendMail() {
        this.configMailData();
        return this.http.post(this.url, this.mailData, { observe: 'response' });        
    }
}