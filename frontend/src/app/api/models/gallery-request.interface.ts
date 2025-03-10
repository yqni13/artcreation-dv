import { ArtGenre } from "../../shared/enums/art-genre.enum"
import { ArtMedium } from "../../shared/enums/art-medium.enum"
import { ArtTechnique } from "../../shared/enums/art-technique.enum"

export declare interface GalleryCreateRequest {
    imagePath: string,
    thumbnailPath: string,
    title?: string,
    price?: number,
    dimensions: string,
    artGenre: ArtGenre,
    artMedium: ArtMedium,
    artTechnique: ArtTechnique,
    publication: number
}

export declare interface GalleryUpdateRequest {
    id: string,
    referenceNr: string,
    imagePath: string,
    thumbnailPath: string,
    title?: string,
    price?: number,
    dimensions: string,
    artGenre: ArtGenre,
    artMedium: ArtMedium,
    artTechnique: ArtTechnique,
    publication: number
}
