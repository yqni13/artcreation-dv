export interface LocalStorageValue<T> {
    content: T,
    expiresAt: string // ISO-String
}