/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    standalone: true,
    name: 'floatPrecision'
})
export class FloatPrecisionPipe implements PipeTransform{

    transform(value: number | string | null | undefined, decimalPlaces: number): string | null {
        if(decimalPlaces < 0 || decimalPlaces > 20) {
            decimalPlaces = 0;
        }

        return value ? Number.parseFloat(value as string).toFixed(decimalPlaces) : null;
    }
}