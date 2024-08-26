/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    standalone: true,
    name: 'floatPrecision'
})
export class FloatPrecisionPipe implements PipeTransform{

    transform(value: number | null | undefined, decimalPlaces: number): number | null {
        if(decimalPlaces < 0 || decimalPlaces > 20) {
            decimalPlaces = 0;
        }
        return value ? ((value as any).toFixed(decimalPlaces) as number) : null;
    }
}