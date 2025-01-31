import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DateTimeService {

    getTimeInMillisecondsFromHours(time: number): number {
        // time value in hours
        return time * 60 * 60 * 1000;
    }

    addTimestampWithCurrentMoment(time: number) {
        return Date.now() + time;
    }
}