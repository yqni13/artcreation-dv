import { Pipe, PipeTransform } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";

@Pipe({
    name: 'controlCast'
})
export class CastAbstractToFormControlPipe implements PipeTransform {
    transform(value: AbstractControl | null): FormControl {
        return value as FormControl;
    }
}