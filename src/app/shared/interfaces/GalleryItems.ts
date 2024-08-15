export declare interface GalleryItem {
    title: string | null,
    referenceNr: string,
    tags: string[] | null,
    price: number | null,
    type: string,
    comment: string | null,
    technique: string | null,
    measurementsWxH: number[] | null,
    date: number | null,
    path: string
}

export type GalleryItemCollection = Record<string, GalleryItem>;