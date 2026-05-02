import { WritableSignal } from "@angular/core"

export interface ImgUploadData {
    files: File,
    target: any
}

export interface ImgUploadInformation {
    hasFile: boolean,
    imageSize: WritableSignal<number>,
    imageName: WritableSignal<string>,
    imagePreview: WritableSignal<string>,
    uploadProgress: WritableSignal<number>,
    uploadSuccess: boolean,
    uploadError: boolean
}