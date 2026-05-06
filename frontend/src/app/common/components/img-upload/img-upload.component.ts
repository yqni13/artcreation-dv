/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, computed, ElementRef, inject, input, OnInit, output, signal, viewChild } from "@angular/core";
import { ImgUploadData, ImgUploadInformation } from "../../../shared/interfaces/img-upload.interface";
import { ImgUploadService } from "../../../shared/services/img-upload.service";
import { TranslateModule } from "@ngx-translate/core";
import { environment } from "../../../../environments/environment";
import { ArtFrame } from "../../../shared/enums/art-frame.enum";
import { ImgFrameComponent } from "../img-frame/img-frame.component";
import { AdminRoute } from "../../../api/routes/admin.route.enum";

@Component({
    selector: 'artdv-imgupload',
    imports: [
        ImgFrameComponent,
        TranslateModule
    ],
    templateUrl: './img-upload.component.html',
    styleUrl: './img-upload.component.scss'
})
export class ImgUploadComponent implements OnInit {

    private readonly imgUploadService = inject(ImgUploadService);

    private readonly fileInput = viewChild<ElementRef>('fileInput');

    readonly existingImgPath = input<string | null>(null);
    readonly frameModel = input<ArtFrame>(ArtFrame.DEFAULT);
    readonly frameColor = input('#ffffff');
    readonly adminTarget = input<AdminRoute>(AdminRoute.GALLERY);
    readonly emptyOnSubmit = input(false);
    protected readonly isEmptyOnSubmit = computed(() => this.emptyOnSubmit() && !this.fileInformation().hasFile);

    readonly byChange = output<any>();
    readonly byRemove = output<any>();

    protected sizeFactorInMB = 4;
    protected showValidationMessage = false;
    protected storageDomain = environment.STORAGE_URL.trim();
    protected AdminTargetEnum = AdminRoute;
    protected readonly fileInformation = signal<ImgUploadInformation>({
        hasFile: false,
        imageSize: 0,
        imageName: '',
        imagePreview: '',
        uploadProgress: 0,
        uploadSuccess: false,
        uploadError: false,
    });

    ngOnInit() {
        this.imgUploadService.setMaxFileSize(this.sizeFactorInMB);
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
        } else {
            this.removeImage();
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
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
        } else {
            this.removeImage();
        }
    }

    uploadImage(file: ImgUploadData | null) {
        if(file?.files) {
            const reader = new FileReader();
            reader.onload = (event: any) => {
                this.fileInformation.update(data => ({
                    ...data,
                    imagePreview: (event.target.result as string),
                    hasFile: true
                }));
                this.showValidationMessage = false;
                this.byChange.emit(file.files);
            };
            reader.readAsDataURL(file.files);
            this.fileInformation.update(data => ({
                ...data,
                uploadSuccess: true,
                uploadError: false,
                imageName: file.files.name
            }));
        } else {
            this.fileInformation.update(data => ({
                ...data,
                uploadSuccess: false,
                uploadError: true,
            }));
        }
    }

    resetFileInput() {
        // Clean file information to enable validation for multiple uses of same image in a row.
        this.fileInput()!.nativeElement.value = null;
        this.fileInput()!.nativeElement.files = [];
    }

    removeImage() {
        this.fileInformation.set({
            hasFile: false,
            imageSize: 0,
            imageName: '',
            imagePreview: '',
            uploadProgress: 0,
            uploadSuccess: false,
            uploadError: false
        });
        this.showValidationMessage = true;
        const removeInfo = { existingImgPath: false };
        this.byRemove.emit(removeInfo);
        this.resetFileInput();
    }
}