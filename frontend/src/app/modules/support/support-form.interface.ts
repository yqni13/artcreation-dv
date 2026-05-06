import { SupportDeviceOption } from "../../api/enums/device-option.support.enum";
import { SupportOption } from "../../api/enums/ticket-option.support.enum";

export interface SupportTicketData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attachment?: any[],
    userEmail: string,
    option: SupportOption,
    title: string,
    message: string,
    device?: SupportDeviceOption,
    os?: string,
    browser?: string,
}

export interface SupportFeedbackData {
    userEmail: string,
    option: SupportOption,
    rating: number,
    termFeedback: boolean,
    message?: string
}

/**
 * @description Extend params to overwrite data when initiating form (initEdit()).
 */
export interface SupportInitEditParams {
    option?: SupportOption
}