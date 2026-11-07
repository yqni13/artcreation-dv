import { ArtGenre } from "../../shared/enums/art-genre.enum"

export interface NewsItem {
    news_id: string,
    gallery?: string,
    image_path?: string,
    thumbnail_path?: string,
    title: string,
    content: string,
    edited: boolean,
    created_on: string,
    last_modified: string
}

/**
 * @description Full name: NewsItemWithGalleryPaths.
 */
export interface NewsItemWGP {
    news_id: string,
    gallery?: string,
    image_path?: string,
    thumbnail_path?: string,
    title: string,
    content: string,
    edited: boolean,
    created_on: string,
    last_modified: string,
    image_path_gallery?: string,
    thumbnail_path_gallery?: string,
    reference_nr_gallery?: string,
    art_genre_gallery?: ArtGenre
}

export interface NewsItemResponse {
    body: {
        data: NewsItem | NewsItemWGP
    }
}

export interface NewsListResponse {
    body: {
        db_operation: string,
        number_of_entries: number,
        data: NewsItem[] | NewsItemWGP[]
    }
}

export interface NewsCreateUpdateResponse {
    body: {
        db_operation: string,
        id: string
    }
}

export interface NewsDeleteResponse {
    body: {
        db_operation: string,
        deleted: boolean
    }
}
