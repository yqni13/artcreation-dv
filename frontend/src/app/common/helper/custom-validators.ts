import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { ReferenceCheckService } from "../../shared/services/reference-check.service";

export const invalidRefNrValidator = (refCheckService: ReferenceCheckService): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        if(control?.value.length === 6) {
            return !refCheckService.checkReferenceValidity(control.value)
            ? {invalidRefNr: true}
            : null;
        }
        return null;
    }
}

export const invalidRefNrLengthValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        if(control?.value.length !== 6 && control?.value.length !== 0) {
            return { invalidRefNrLength: true };
        }
        return null;
    }
}