/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from "@angular/core";
import { ContactFormItem } from "../../shared/interfaces/ContactMailItems";
import { SubjectOptions } from "../../shared/enums/contact-subject.enum";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { EncryptionService } from "../../shared/services/encryption.service";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class MailAPIService {

    private readonly http = inject(HttpClient);
    private readonly crypto = inject(EncryptionService);

    private url = `${environment.API_BASE_URL.trim()}/api/v1/mailing/send`;
    private mailParams: Record<string, unknown> = {};
    private mailData: ContactFormItem = {
        subject: '',
        referenceNr: '',
        to: '',
        honorifics: '',
        title: '',
        firstName: '',
        lastName: '',
        price: '',
        body: ''
    };

    async setMailData(data: any) {
        this.mailData = {
            subject: data.subject,
            referenceNr: data.referenceNr,
            to: data.email,
            honorifics: data.honorifics,
            title: data.title,
            firstName: data.firstName,
            lastName: data.lastName,
            price: data.price,
            body: data.message
        };

        await this.configMailData();
    }

    private async configMailData() {
        this.mailData.subject = this.mailData.subject === SubjectOptions.artOrder 
        ? `${this.mailData.subject}: ${this.mailData.referenceNr}`
        : this.mailData.subject;

        const msgTitle = this.mailData.title !== ''
            ? `${this.mailData.title} `
            : ''

        const msgArtworkData = (this.mailData.referenceNr === undefined || this.mailData.referenceNr?.length > 0)
            ? this.mailData.referenceNr?.toUpperCase()
            : `--`

        this.mailData.body = `This email was sent by: ${this.mailData.honorifics} ${msgTitle}${this.mailData.firstName} ${this.mailData.lastName}\nEmail: ${this.mailData.to}\n${this.mailData.referenceNr ? 'Reference-Number: ' + msgArtworkData : ''}\n\nMessage: ${this.mailData.body}`;

        try {
            this.mailParams = {
                sender: await this.crypto.encryptRSA(this.mailData.to),
                subject: await this.crypto.encryptRSA(this.mailData.subject),
                body: await this.crypto.encryptAES(this.mailData.body)
            }
        } catch(err) {
            console.log("Mail could not be send due to loading error: ", err);
        }
    }

    sendMail(): Observable<HttpResponse<any>> {
        return this.http.post<any>(this.url, this.mailParams, { observe: 'response'});
    }
}