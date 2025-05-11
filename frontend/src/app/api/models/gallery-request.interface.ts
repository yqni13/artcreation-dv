import { ArtGenre } from "../../shared/enums/art-genre.enum"
import { ArtMedium } from "../../shared/enums/art-medium.enum"
import { ArtTechnique } from "../../shared/enums/art-technique.enum"
import { SaleStatus } from "../../shared/enums/sale-status.enum"

export declare interface GalleryCreateRequest {
    imagePath: string,
    thumbnailPath: string,
    title?: string,
    saleStatus: SaleStatus,
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
    saleStatus: SaleStatus,
    price?: number,
    dimensions: string,
    artGenre: ArtGenre,
    artMedium: ArtMedium,
    artTechnique: ArtTechnique,
    publication: number
}
