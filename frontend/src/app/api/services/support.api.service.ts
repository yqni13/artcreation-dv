import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { SupportCreateTicketRequest, SupportCreateTicketResponse } from "../interfaces/support.interface";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { SupportTicketOption } from "../enums/ticket-option.support.enum";

@Injectable({
    providedIn: 'root'
})
export class SupportAPIService {

    private ticketData: SupportCreateTicketRequest;
    private domainPathV1Tickets: string;
    private urlCreateTicket: string;

    constructor(private readonly http: HttpClient) {
        this.ticketData = {
            attachment: null,
            userEmail: '',
            option: SupportTicketOption.FEEDBACK,
            title: '',
            message: '',
        };
        this.domainPathV1Tickets = '/api/v1/tickets';
        this.urlCreateTicket = `${environment.API_SUPPORT_URL}${this.domainPathV1Tickets}/create`;
    }

    setCreateTicketData(data: SupportCreateTicketRequest) {
        this.ticketData = data;
    }

    sendCreateTicketRequest(): Observable<HttpResponse<SupportCreateTicketResponse>> {
        return this.http.post<SupportCreateTicketResponse>(this.urlCreateTicket, this.ticketData, { 
            headers: {
                'Support-Api-Key': environment.API_SUPPORT_KEY
            },
            observe: 'response'
        }).pipe(
            catchError(err => throwError(() => err))
        );
    }
}