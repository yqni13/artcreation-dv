export interface Environment {
    production: boolean,
    STORAGE_URL: string,
    API_BASE_URL: string,
    IV_POSITION: number,
    AES_PASSPHRASE: string,
    PUBLIC_KEY: string
}