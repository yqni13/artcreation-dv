import { Pipe, PipeTransform } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";

@Pipe({
    standalone: true,
    name: 'controlCast'
})
export class ControlCastPipe implements PipeTransform {
    transform(value: AbstractControl | null): FormControl {
        return value as FormControl;
    }
}