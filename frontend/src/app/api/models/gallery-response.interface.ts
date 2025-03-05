export declare interface GalleryItem {
    gallery_id: string,
    reference_nr: string,
    image_path: string,
    thumbnail_path: string,
    title?: string,
    price?: number,
    dimensions: string,
    art_genre: string,
    art_medium: string,
    art_technique: string,
    publication_year: number,
    created_on: string,
    last_modified: string
}

export declare interface GalleryListResponse {
    body: {
        db_operation: string,
        number_of_entries: number,
        data: GalleryItem[]
    }
}