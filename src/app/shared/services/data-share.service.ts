/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataShareService {

    private sharedDataSubject = new BehaviorSubject<any>('');
    sharedData$ = this.sharedDataSubject.asObservable();

    setSharedData<T>(data: T) {
        this.sharedDataSubject.next(data);
    }
}