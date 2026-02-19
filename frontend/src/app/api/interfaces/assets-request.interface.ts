import { AssetsCategory } from "../../shared/enums/assets-category.enum";

export declare interface AssetsCreateRequest {
    category: AssetsCategory,
    imagePath: string,
    thumbnailPath: string,
    location?: string,
    datetime: string,
}

export declare interface AssetsUpdateRequest {
    id: string,
    category: AssetsCategory,
    imagePath: string,
    thumbnailPath: string,
    location?: string,
    datetime: string,
}