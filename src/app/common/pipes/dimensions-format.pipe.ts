import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    standalone: true,
    name: 'dimensionFormat'
})
export class DimensionsFormatPipe implements PipeTransform {
    transform(value: number[] | null | undefined): string {
        value = value || [0];
        switch(value.length) {
            case(1):
                return `${value[0]} cm`;
            case(2):
                return `${value[0]} x ${value[1]} cm (w/h)`;
            case(3):
                return `${value[0]} x ${value[1]} x ${value[2]} cm (w/h/d)`;
            default:
                return '';
        }
    }
}