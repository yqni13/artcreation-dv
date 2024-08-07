import { SubjectOptions } from "../enums/contact-subject.enum";

export declare interface ContactMailItem {
    subject: string,
    referenceNr?: number,
    email: string,
    firstName: string,
    lastName: string,
    message: string
} 