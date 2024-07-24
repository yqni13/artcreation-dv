export declare interface NewsUpdateStorage {
    date: string,
    title: string,
    text: string,
    path: string
}

export type NewsUpdateStorageItem = Record<string, NewsUpdateStorage>;