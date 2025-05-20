export const templateUtils = {

    /**
     * @description Add param to check if (existing) cached or new version of file shall be loaded.
     * @param {string} timestamp Timestamp as string, readable for Date Type.
     * @returns {string}
     */
    addUrlCacheCheckParam: (timestamp?: string): string => {
        const alteredPath = !timestamp ? new Date().getTime() : new Date(timestamp).getTime();
        return `?v=${alteredPath}`;
    }
}