import { SupportDeviceOption } from "../enums/device-option.support.enum";
import { SupportTicketOption } from "../enums/ticket-option.support.enum";

export interface SupportCreateTicketRequest {
    attachment: any,
    userEmail: string,
    option: SupportTicketOption,
    feedback?: number,
    device?: SupportDeviceOption,
    os?: string,
    browser?: string,
    title: string,
    message: string,
    termFeedback?: boolean
}

export interface SupportCreateTicketResponse {
    ticketId: string,
    clientId: string,
    userId: string,
    status: string,
    option: SupportTicketOption,
    message: string,
    resource_paths?: string[],
    flag: string | null,
    last_modified: string,
    created_on: string
}