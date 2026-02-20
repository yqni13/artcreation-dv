import { ArtFrame } from "../../shared/enums/art-frame.enum"
import { ArtGenre } from "../../shared/enums/art-genre.enum"
import { ArtMedium } from "../../shared/enums/art-medium.enum"
import { ArtTechnique } from "../../shared/enums/art-technique.enum"

export declare interface GalleryItem {
    gallery_id: string,
    reference_nr: string,
    image_path: string,
    thumbnail_path: string,
    title?: string,
    sale_status: string,
    price?: number,
    dimensions: string,
    art_genre: ArtGenre,
    art_medium: ArtMedium,
    art_technique: ArtTechnique,
    art_frame_model: ArtFrame,
    art_frame_color: string,
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

export declare interface GalleryItemResponse {
    body: {
        data: GalleryItem
    }
}

export declare interface GalleryCreateUpdateResponse {
    body: {
        db_operation: string,
        id: string
    }
}

export declare interface GalleryDeleteResponse {
    body: {
        db_operation: string,
        deleted: boolean
    }
}

export declare interface GalleryRefNrPreviewResponse {
    body: {
        referenceNr: string
    }
}