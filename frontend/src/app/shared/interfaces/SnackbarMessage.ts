import { SnackbarOption } from "../enums/snackbar-option.enum";

/* eslint-disable @typescript-eslint/no-explicit-any */
export declare interface SnackbarMessage {
    title: string,
    text?: string,
    autoClose?: boolean,
    type: SnackbarOption,
    displayTime?: number,
    displayHandler?: any,
}