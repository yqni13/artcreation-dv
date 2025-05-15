export declare interface NewsItem {
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

export declare interface NewsLeftJoin {
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
}

export declare interface NewsItemResponse {
    body: {
        data: NewsItem
    }
}

export declare interface NewsListResponse {
    body: {
        db_operation: string,
        number_of_entries: number,
        data: NewsItem[] | NewsLeftJoin[]
    }
}

export declare interface NewsCreateUpdateResponse {
    body: {
        db_operation: string,
        id: string
    }
}

export declare interface NewsDeleteResponse {
    body: {
        db_operation: string,
        deleted: boolean
    }
}
