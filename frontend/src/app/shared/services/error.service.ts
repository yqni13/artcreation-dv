import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    
    private message = '';

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