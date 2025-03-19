import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, signal, ViewChild } from "@angular/core";
import { ImgUploadData, ImgUploadInformation } from "../../../shared/interfaces/ImgUpload.interface";
import { ImgUploadService } from "../../../shared/services/img-upload.service";
import { TranslateModule } from "@ngx-translate/core";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: 'artdv-imgupload',
    templateUrl: './img-upload.component.html',
    styleUrl: './img-upload.component.scss',
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class ImgUploadComponent implements OnInit, OnDestroy {

    @ViewChild('fileInput') fileInput!: any;
    @ViewChild('dropContainer') dropContainer!: any;
    @ViewChild('artworkImage', {static: false}) artworkImage: ElementRef<HTMLCanvasElement | null>

    @Input() existingImgPath: string | null;
    @Input() isUploadValid: Subject<boolean>;

    protected fileInformation: ImgUploadInformation;
    protected sizeFactorInMB: number;
    protected showValidationMessage: boolean;
    
    private destroy$: Subject<void>;

    @Output() byChange: EventEmitter<any>;
    @Output() byRemove: EventEmitter<any>;

    constructor(
        private readonly imgUploadService: ImgUploadService,
    ) {
        this.artworkImage = {} as ElementRef;

        this.existingImgPath = null;
        this.isUploadValid = new Subject<boolean>();

        this.fileInformation = {
            hasFile: false,
            imageSize: signal(0),
            imageName: signal(''),
            imagePreview: signal(''),
            uploadProgress: signal(0),
            uploadSuccess: false,
            uploadError: false,
            width: 0,
            height: 0
        };
        this.sizeFactorInMB = 10;
        this.showValidationMessage = false;
        this.destroy$ = new Subject<void>();

        this.byChange = new EventEmitter<any>();
        this.byRemove = new EventEmitter<any>();
    }

    ngOnInit() {
        this.imgUploadService.setMaxFileSize(this.sizeFactorInMB);
        this.isUploadValid.pipe(takeUntil(this.destroy$)).subscribe((isValid: boolean) => {
            this.showValidationMessage = !isValid;
        })
    }

    onFileDrop(event: DragEvent): void {
        const size = event.dataTransfer?.files[0].size ?? null;
        const type = event.dataTransfer?.files[0].type ?? null;
        event.preventDefault();
        if(event.dataTransfer && this.imgUploadService.checkUploadedImage(size, type)) {
            const file: ImgUploadData = {
                files: event.dataTransfer?.files[0],
                target: event
            }
            this.uploadImage(file);
            this.byChange.emit(file);
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault(); // Prevent default dragover behavior
    }

    onFileSelect(event: any) {
        const size = event.target?.files[0].size ?? null;
        const type = event.target?.files[0].type ?? null;
        if(event.target && this.imgUploadService.checkUploadedImage(size, type)) {
            const file: ImgUploadData = {
                files: event.target?.files[0],
                target: event.target
            }
            this.uploadImage(file);
        }
    }

    uploadImage(file: ImgUploadData | null) {
        if(file?.files) {
            const reader = new FileReader();
            reader.onload = (event: any) => {
                this.fileInformation.imagePreview.set(event.target.result as string);
                this.isUploadValid.next(true);
                this.fileInformation.hasFile = true;
                this.byChange.emit(file.files);
            };
            reader.readAsDataURL(file.files);
            this.fileInformation.uploadSuccess = true;
            this.fileInformation.uploadError = false;
            this.fileInformation.imageName.set(file.files.name);
        } else {
            this.fileInformation.uploadSuccess = false;
            this.fileInformation.uploadError = true;
            
        }
    }

    removeImage() {
        this.fileInformation.hasFile = false;
        this.fileInformation.imageSize.set(0);
        this.fileInformation.imageName.set('');
        this.fileInformation.imagePreview.set('');
        this.fileInformation.uploadProgress.set(0);
        this.fileInformation.uploadSuccess = false;
        this.fileInformation.uploadError = false;
        this.fileInformation.width = 0;
        this.fileInformation.height = 0;
        this.showValidationMessage = true;
        const removeInfo = {
            existingImgPath: false
        }
        this.byRemove.emit(removeInfo);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}