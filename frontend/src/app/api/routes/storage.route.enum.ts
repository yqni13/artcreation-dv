export type StorageRoute = 'artwork_original' | 'artwork_resized' | 'news_original' | 'news_resized' | 'assets_original' | 'assets_resized';

export const StorageRoute = {
    ART_ORIGINAL: 'artwork_original' as StorageRoute,
    ART_RESIZED: 'artwork_resized' as StorageRoute,
    ASSETS_ORIGINAL: 'assets_original' as StorageRoute,
    ASSETS_RESIZED: 'assets_resized' as StorageRoute,
    NEWS_ORIGINAL: 'news_original' as StorageRoute,
    NEWS_RESIZED: 'news_resized' as StorageRoute
}