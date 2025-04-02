import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { GalleryItem } from "../../api/models/gallery-response.interface";
import { SaleStatus } from "../../shared/enums/sale-status.enum";
import { SubjectOptions } from "../../shared/enums/contact-subject.enum";

export const invalidRefNrValidator = (artwork: GalleryItem, subject: SubjectOptions): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        if(control?.value.length === 6 && artwork) {
            if(!artwork.reference_nr) {
                return { invalidRefNr: true }
            } else if(artwork.sale_status === SaleStatus.UNAVAILABLE) {
                return { unavailableArtwork: true }
            } else if(subject === SubjectOptions.artOrder && artwork.price === null) {
                return { invalidPurchaseArtwork: true }
            }
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

export const invalidPublicationValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        if(control?.value !== '') {
            if(!control?.value.match(/^[0-9]+$/)) {
                return { invalidPublicationContent: true };
            }
            const publication = control?.value as number;
            if(publication < 1000 || publication > 2100) {
                return { invalidPublicationYear: true}
            }
        }
        return null;
    }
}