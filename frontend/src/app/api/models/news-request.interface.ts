export declare interface NewsCreateRequest {
    gallery_id?: string,
    imagePath?: string,
    thumbnailPath?: string,
    title: string,
    content: string
}

export declare interface NewsUpdateRequest {
    news_id: string,
    gallery_id?: string,
    imagePath?: string,
    thumbnailPath?: string,
    title: string,
    content: string
}