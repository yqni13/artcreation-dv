import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { SupportTicketResponse, SupportFeedbackRequest, SupportTicketRequest, SupportFeedbackResponse, SupportRatingResponse } from "../interfaces/support.interface";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { SupportFeedbackData, SupportTicketData } from "../../modules/support/support-form.interface";

@Injectable({
    providedIn: 'root'
})
export class SupportAPIService {

    private readonly http = inject(HttpClient);

    private ticketData = new FormData();
    private feedbackData: SupportFeedbackRequest = {
        user_email: '',
        rating: 5,
        term_accepted: true
    };
    private domainPathV1 = '/api/v1';
    private urlTicket = `${environment.API_SUPPORT_URL}${this.domainPathV1}/tickets/create`;
    private urlFeedback = `${environment.API_SUPPORT_URL}${this.domainPathV1}/feedback/create`;
    private urlRating = `${environment.API_SUPPORT_URL}${this.domainPathV1}/feedback-rating/name`;

    setTicketData(data: SupportTicketData) {
        this.ticketData = new FormData(); // Reset to avoid zombie data.

        if(data.attachment && data.attachment.length > 0) {
            data.attachment.forEach(file => this.ticketData.append('attachment', file));
        }

        const payloadForm: Partial<SupportTicketRequest> = {
            user_email: data.userEmail,
            option: data.option,
            title: data.title,
            message: data.message,
            info_device: !data.device ? undefined : data.device,
            info_os: data.os === '' ? undefined : data.os,
            info_browser: data.browser === '' ? undefined : data.browser
        };

        this.ticketData.append('data', JSON.stringify(payloadForm));
    }

    setFeedbackData(data: SupportFeedbackData) {
        this.feedbackData = {
            user_email: data.userEmail,
            rating: data.rating,
            term_accepted: data.termFeedback,
            message: data.message === '' ? undefined : data.message
        };
    }

    sendTicketRequest(): Observable<HttpResponse<SupportTicketResponse>> {
        return this.http.post<SupportTicketResponse>(this.urlTicket, this.ticketData, { 
            headers: {
                'Support-Api-Key': environment.API_SUPPORT_KEY
            },
            observe: 'response'
        }).pipe(
            catchError(err => throwError(() => err))
        );
    }

    sendFeedbackRequest(): Observable<HttpResponse<SupportFeedbackResponse>> {
        return this.http.post<SupportFeedbackResponse>(this.urlFeedback, this.feedbackData, { 
            headers: {
                'Support-Api-Key': environment.API_SUPPORT_KEY
            },
            observe: 'response'
        }).pipe(
            catchError(err => throwError(() => err))
        );
    }

    sendRatingRequest(): Observable<HttpResponse<SupportRatingResponse>> {
        return this.http.get<SupportRatingResponse>(`${this.urlRating}/artcreation-dv`, { 
            headers: {
                'Support-Api-Key': environment.API_SUPPORT_KEY
            },
            observe: 'response'
        }).pipe(
            catchError(err => throwError(() => err))
        );
    }
}