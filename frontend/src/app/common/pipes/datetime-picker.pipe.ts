import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'dtPicker'
})
export class DateTimePickerPipe implements PipeTransform {
    transform(value: string): string | null {
        const dt = new Date(value);
        if(isNaN(dt.getTime())) {
            return null;
        }

        const pad = (n: number) => n.toString().padStart(2, '0');

        const year = dt.getFullYear();
        const month = pad(dt.getMonth()+1);
        const day = pad(dt.getDate());
        const hours = pad(dt.getHours());
        const minutes = pad(dt.getMinutes());

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
}