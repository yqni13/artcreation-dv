import { WritableSignal } from "@angular/core"

export declare interface ImgUploadData {
    files: File,
    target: any
}

export declare interface ImgUploadInformation {
    hasFile: boolean,
    imageSize: WritableSignal<number>,
    imageName: WritableSignal<string>,
    imagePreview: WritableSignal<string>,
    uploadProgress: WritableSignal<number>,
    uploadSuccess: boolean,
    uploadError: boolean
}