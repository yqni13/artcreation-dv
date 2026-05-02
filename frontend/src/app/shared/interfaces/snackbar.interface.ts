import { SnackbarOption } from "../enums/snackbar-option.enum";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SnackbarMessage {
    title: string,
    text?: string,
    autoClose?: boolean,
    type: SnackbarOption,
    displayTime?: number, // in milliseconds
    displayHandler?: any,
}

export interface SnackbarParameter {
    val: string | null,
    len: string | null,
    min: string | null,
    max: string | null
}