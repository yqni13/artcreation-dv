import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HttpObservationService {

    private emailStatusSubject = new BehaviorSubject<boolean>(false);
    emailStatus$ = this.emailStatusSubject.asObservable();

    setEmailStatus(isOK: boolean) {
        this.emailStatusSubject.next(isOK);
    }
}