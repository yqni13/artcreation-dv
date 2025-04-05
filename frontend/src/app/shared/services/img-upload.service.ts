import { Injectable } from "@angular/core";
import { SnackbarMessageService } from "./snackbar.service";
import { SnackbarParameter } from "../interfaces/SnackbarMessage";
import { TranslateService } from "@ngx-translate/core";
import { StaticTranslateService } from "./static-translation.service";
import { SnackbarOption } from "../enums/snackbar-option.enum";
import { SnackbarInput } from "../enums/snackbar-input.enum";

@Injectable({
    providedIn: 'root'
})
export class ImgUploadService {

    private sizeFactorInMB: number;
    private maxFileSize: number;

    constructor(
        private readonly translate: TranslateService,
        private readonly snackbar: SnackbarMessageService,
        private readonly staticTranslate: StaticTranslateService,
    ) {
        this.sizeFactorInMB = 10;
        this.maxFileSize = 1024 * 1024 * this.sizeFactorInMB;
    }

    setMaxFileSize(limit: number) {
        this.sizeFactorInMB = limit;
    }

    checkUploadedImage(fileSize: number | null, type: string | null): boolean {
        return !this.checkImageSize(fileSize) || !this.checkImageType(type) ? false : true;
    }

    private checkImageSize(fileSize: number | null): boolean {
        if(!fileSize) {
            return false;
        }
        if(fileSize >= this.maxFileSize) {
            const params: SnackbarParameter = {
                val: `${this.sizeFactorInMB}MB`,
                len: null,
                min: null,
                max: null
            }
            const titlePath = 'validation.frontend.img-upload.title-size-max';
            const textPath = 'validation.frontend.img-upload.text-size-max';
            this.snackbar.notify({
                title: this.translate.currentLang === 'de'
                    ? this.staticTranslate.getValidationDE(titlePath, SnackbarInput.TITLE)
                    : this.staticTranslate.getValidationEN(titlePath, SnackbarInput.TITLE),
                text: this.translate.currentLang === 'de'
                    ? this.staticTranslate.getValidationDE(textPath, SnackbarInput.TEXT, params)
                    : this.staticTranslate.getValidationEN(textPath, SnackbarInput.TEXT, params),
                autoClose: true,
                type: SnackbarOption.warning,
                displayTime: 5000
            })
        }
        return fileSize < this.maxFileSize ? true : false;
    }

    private checkImageType(type: string | null): boolean {
        if(!type) {
            return false;
        }
        const allowedTypes = ['jpg', 'jpeg', 'png', 'webp'];
        if(!allowedTypes.includes(type.replace('image/', ''))) {
            const titlePath = 'validation.frontend.img-upload.title-type-allowed';
            const textPath = 'validation.frontend.img-upload.text-type-allowed';
            this.snackbar.notify({
                title: this.translate.currentLang === 'de'
                    ? this.staticTranslate.getValidationDE(titlePath, SnackbarInput.TITLE)
                    : this.staticTranslate.getValidationEN(titlePath, SnackbarInput.TITLE),
                text: this.translate.currentLang === 'de'
                    ? this.staticTranslate.getValidationDE(textPath, SnackbarInput.TEXT)
                    : this.staticTranslate.getValidationEN(textPath, SnackbarInput.TEXT),
                autoClose: true,
                type: SnackbarOption.warning,
                displayTime: 5000
            })
            return false;
        }
        
        return true;
    }
}