import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
    transform(value: string | number | Date, format: string): string {
        const dateVal = new Date(value);
        const leadingZeroDay = (dateVal.getDate()) < 10 ? '0' : '';
        const leadingZeroMonth = (dateVal.getMonth()+1) < 10 ? '0' : '';

        switch(format) {
            case('yyyy-mm-dd'): {
                return `${dateVal.getFullYear()}-${leadingZeroMonth + (dateVal.getMonth()+1)}-${leadingZeroDay + dateVal.getDate()}`;
            }
            case('dd.mm.yyyy'): {
                return `${leadingZeroDay + dateVal.getDate()}.${leadingZeroMonth + (dateVal.getMonth()+1)}.${dateVal.getFullYear()}`;
            }
            case('dd/mm/yyyy'): {
                return `${leadingZeroDay + dateVal.getDate()}/${leadingZeroMonth + (dateVal.getMonth()+1)}/${dateVal.getFullYear()}`;
            }
            case('mm/dd/yyyy'): {
                return `${leadingZeroMonth + (dateVal.getMonth()+1)}/${leadingZeroDay + dateVal.getDate()}/${dateVal.getFullYear()}`;
            }
            default:
                return 'missing format'
        }
    }
}