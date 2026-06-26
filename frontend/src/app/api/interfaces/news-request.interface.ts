export interface NewsCreateRequest {
    galleryId?: string,
    imagePath?: string,
    thumbnailPath?: string,
    title: string,
    content: string
}

export interface NewsUpdateRequest {
    id: string,
    galleryId?: string,
    imagePath?: string,
    thumbnailPath?: string,
    title: string,
    content: string
}