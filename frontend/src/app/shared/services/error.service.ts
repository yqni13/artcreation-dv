import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    
    private message = '';

    // TODO(yqni13): Implement new efficient error handling (ticket reference: ARTDV-45)

    /**
     * 
     * @description Simple console log of error messages.
     */
    handle(e: unknown) {
        if (e instanceof Error) {
            this.message = e.message;
        } else if (typeof e === 'string') {
            this.message = e;
        } else {
            this.message = "Unknown error."
        }

        console.log(this.message);
    }
}