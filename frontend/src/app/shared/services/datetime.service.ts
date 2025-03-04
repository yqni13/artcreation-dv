import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DateTimeService {

    getTimeInMillisecondsFromExpiration(time: string): number {
        if(time.includes('h')) {
            time = time.replace('h', '');
            return Number(time) * 60 * 60 * 1000;
        }
        if(time.includes('m')) {
            time = time.replace('m', '');
            return Number(time) * 60 * 1000;
        }

        return 0;
    }

    getTimeInMillisecondsFromHours(time: number): number {
        // time value in hours
        return time * 60 * 60 * 1000;
    }

    addTimestampWithCurrentMoment(time: number) {
        return Date.now() + time;
    }
}