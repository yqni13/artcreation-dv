import { ElementRef, Injectable } from "@angular/core";
import { SnackbarMessageService } from "./snackbar.service";
import { FileUploadValidations } from "../interfaces/file-upload.interface";
import { SnackbarInput } from "../enums/snackbar-input.enum";
import { StaticTranslateService } from "./static-translation.service";
import { TranslateService } from "@ngx-translate/core";
import { SnackbarOption } from "../enums/snackbar-option.enum";
import { SnackbarParameter } from "../interfaces/snackbar.interface";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FileUploadService {

    private maxSizeEachInBytes: number;
    private maxNumber: number;
    private allowedTypes: string[];
    private allowedTypesIndicators: string[];
    private fileTransfer = new Subject<any>();

    protected selectedFiles: File[];
    fileTransfer$ = this.fileTransfer.asObservable();

    constructor(
        private readonly translate: TranslateService,
        private readonly snackbar: SnackbarMessageService,
        private readonly staticTranslate: StaticTranslateService,
    ) {
        this.selectedFiles = [];

        this.maxSizeEachInBytes = 0;
        this.maxNumber = 0;
        this.allowedTypes = [];
        this.allowedTypesIndicators = [];
    }

    selectFiles(event: any) {
        let newFiles: File[] = Array.from(event.target.files);

        newFiles = this.validateMaxNumberOfFiles(newFiles);
        newFiles = this.validateAllowedFileTypes(newFiles);
        newFiles = this.validateMaxSizeOfEachFile(newFiles);

        this.selectedFiles = [
            ...this.selectedFiles,
            ...newFiles
        ];
        this.fileTransfer.next(this.selectedFiles);
    }

    setValidations(validations: FileUploadValidations) {
        this.maxNumber = validations.maxNumberOfFiles;
        this.maxSizeEachInBytes = validations.maxSizeEachFileInMB * 1024 * 1024;
        this.allowedTypes = validations.allowedFileTypes;
        this.allowedTypesIndicators = validations.allowedFileTypeIndicators;
    }

    private validateMaxNumberOfFiles(uncheckedFiles: File[]): File[] {
        // Check if new files are added to existing files.
        const numberOfExistingFiles = this.selectedFiles.length;
        if(uncheckedFiles.length > (this.maxNumber - numberOfExistingFiles)) {
            this.notifyInfo(
                'validation.frontend.file-upload.title.max-number-total',
                'validation.frontend.file-upload.text.max-number-total',
                {val: null, len: null, min: null, max: `${this.maxNumber}`}
            );
            return uncheckedFiles.filter((file, idx) => idx < (this.maxNumber - numberOfExistingFiles));
        }
        return uncheckedFiles;
    }

    private validateMaxSizeOfEachFile(uncheckedFiles: File[]): File[] {
        const checkedFiles: File[] = [];
        uncheckedFiles.forEach((item: File) => {
            if(item.size <= this.maxSizeEachInBytes) {
                checkedFiles.push(item);
            }
        })
        if(checkedFiles.length !== uncheckedFiles.length) {
            this.notifyInfo(
                'validation.frontend.file-upload.title.max-size-each',
                'validation.frontend.file-upload.text.max-size-each',
                {val: `${this.maxSizeEachInBytes / 1024 / 1024}MB`, len: null, min: null, max: null}
            );
        }
        return checkedFiles;
    }

    private validateAllowedFileTypes(uncheckedFiles: File[]): File[] {
        const checkedFiles: File[] = [];
        uncheckedFiles.forEach((item: File) => {
            if(this.allowedTypes.includes(item.type)) {
                checkedFiles.push(item);
            }
        })
        if(checkedFiles.length !== uncheckedFiles.length) {
            // Modify allowedTypes-string to show ".pdf" instead "application/pdf" for easier readability.
            let notificationVal: string = `${this.allowedTypes}`;
            this.allowedTypesIndicators.forEach((indicator: string) => {
                notificationVal = notificationVal.replaceAll(indicator, " .");
            })
            this.notifyInfo(
                'validation.frontend.file-upload.title.allowed-types',
                'validation.frontend.file-upload.text.allowed-types',
                {val: notificationVal, len: null, min: null, max: null}
            );
        }
        return checkedFiles;
    }

    removeFile(pos: number) {
        this.selectedFiles.splice(pos, 1);
    }

    resetInput(fileInput: ElementRef): ElementRef {
        if(!fileInput?.nativeElement) {
            return fileInput;
        }
        fileInput.nativeElement.value = '';
        fileInput.nativeElement.files = new DataTransfer().files;
        return fileInput;
    }

    private notifyInfo(titlePath: string, textPath: string, params: SnackbarParameter) {
        this.snackbar.notify({
            title: this.translate.currentLang === 'de'
                ? this.staticTranslate.getValidationDE(titlePath, SnackbarInput.TITLE)
                : this.staticTranslate.getValidationEN(titlePath, SnackbarInput.TITLE),
            text: this.translate.currentLang === 'de'
                ? this.staticTranslate.getValidationDE(textPath, SnackbarInput.TEXT, params)
                : this.staticTranslate.getValidationEN(textPath, SnackbarInput.TEXT, params),
            autoClose: false,
            type: SnackbarOption.info
        })
    }
}