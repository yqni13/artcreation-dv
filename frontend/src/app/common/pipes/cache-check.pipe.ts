import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'cacheCheck'
})
export class CacheCheckPipe implements PipeTransform {
    /**
     * @description Add param to check if (existing) cached or new version of file shall be loaded.
     * @param {string} specificTimestamp Param as string, readable for Date Type.
     * @returns {string}
     */
    transform(url: string, specificTimestamp?: string): string {
        const alteredPath = !specificTimestamp 
            ? new Date().getTime()
            : new Date(specificTimestamp).getTime();
        return `${url}?v=${alteredPath}`;
    }
}