import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DateTimeService {

    getTimeInMillisecondsFromHourString(time: string): number {
        // format for time: '123h'
        const allNumbers = time.replaceAll('h', '') as unknown;
        return (allNumbers as number) * 60 * 60 * 1000;
    }

    addTimestampWithCurrentMoment(time: number) {
        return Date.now() + time;
    }
}