export declare interface NewsItem {
    news_id: string,
    gallery_id?: string,
    image_path?: string,
    thumbnail_path?: string,
    title: string,
    text: string,
    edited: boolean,
    created_on: string,
    last_modified: string
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
        data: NewsItem[]
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
