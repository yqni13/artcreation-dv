export interface ImgUploadData {
    files: File,
    target: unknown
}

export interface ImgUploadInformation {
    hasFile: boolean,
    imageSize: number,
    imageName: string,
    imagePreview: string,
    uploadProgress: number,
    uploadSuccess: boolean,
    uploadError: boolean
}