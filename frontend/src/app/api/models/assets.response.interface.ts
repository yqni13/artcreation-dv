import { AssetsCategory } from "../../shared/enums/assets-category.enum"

export declare interface AssetsItem {
    assets_id: string,
    category: AssetsCategory,
    image_path: string,
    thumbnail_path: string,
    location?: string,
    datetime: string,
    last_modified: string,
    created_on: string
}

export declare interface AssetsListResponse {
    body: {
        db_operation: string,
        number_of_entries: number,
        data: AssetsItem[]
    }
}

export declare interface AssetsItemResponse {
    body: {
        data: AssetsItem
    }
}

export declare interface AssetsCreateUpdateResponse {
    body: {
        db_operation: string,
        id: string
    }
}

export declare interface AssetsDeleteResponse {
    body: {
        db_operation: string,
        deleted: boolean
    }
}