import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class ImgPreloadService {

    constructor() {
        //
    }

    private preload(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve();
            img.onerror = () => reject(`image not found: ${url}`);
        });
    }

    preloadMultiple(urls: string[]): Promise<void[]> {
        return Promise.all(urls.map(this.preload));
    }
}