export declare interface NewsUpdateStorage {
    date: string,
    title: string,
    text: string,
    image: string
}

export type NewsUpdateStorageItem = Record<string, NewsUpdateStorage>;