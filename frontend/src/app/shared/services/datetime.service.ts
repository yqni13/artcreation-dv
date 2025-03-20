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

    convertTimestamp(timestamp: string | null): string {
        if(!timestamp) {
            return 'no data';
        }

        const source = new Date(timestamp);
        const day = source.getDate() < 10 ? `0${source.getDate()}` : source.getDate().toString();
        const month = source.getMonth()+1 < 10 ? `0${source.getMonth()+1}` : (source.getMonth()+1).toString();
        const hours = source.getHours() < 10 ? `0${source.getHours()}` : `${source.getHours()}`;
        const minutes = source.getMinutes() < 10 ? `0${source.getMinutes()}` : `${source.getMinutes()}`;
        const seconds = source.getSeconds() < 10 ? `0${source.getSeconds()}` : `${source.getSeconds()}`;
        return `${day}.${month}.${source.getFullYear()}, ${hours}:${minutes}:${seconds}`;
    }

    getTimeInMillisecondsFromHours(time: number): number {
        // time value in hours
        return time * 60 * 60 * 1000;
    }

    addTimestampWithCurrentMoment(time: number) {
        return Date.now() + time;
    }
}