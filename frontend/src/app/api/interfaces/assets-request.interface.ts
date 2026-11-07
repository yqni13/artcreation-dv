import { AssetsCategory } from "../../shared/enums/assets-category.enum";

export interface AssetsCreateRequest {
    category: AssetsCategory,
    imagePath: string,
    thumbnailPath: string,
    location?: string,
    datetime: string,
}

export interface AssetsUpdateRequest {
    id: string,
    category: AssetsCategory,
    imagePath: string,
    thumbnailPath: string,
    location?: string,
    datetime: string,
}