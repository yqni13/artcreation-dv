import { Injectable } from "@angular/core";
import { GalleryItem } from "../interfaces/GalleryItems";
import { default as galleryData } from "../data/gallery-data.json";


@Injectable({
    providedIn: 'root'
})
export class FilterGalleryService {

    private source: GalleryItem[];
    private genres: string[];

    constructor() {
        this.source = [];
        this.genres = [];

        try {
            this.setSource(galleryData);
        } catch(err) {
            console.log('Filter Service failed to initialize necessary data.', err);
        }
    }

    private setSource(data: GalleryItem[]) {
        this.source = data;
    }

    getGenres(): string[] {
        Object.values(this.source).forEach((entries) => {
            Object.entries(entries).forEach(([key, val]) => {
                if(key === 'genre' && !this.genres.includes(val)) {
                    this.genres.push(val);
                }
            })
        })
    
        return this.genres;
    }

    filterByGenre(): Map<string, GalleryItem[]> {
        const results = new Map<string, GalleryItem[]>()
        if(this.genres.length === 0) {
            return results;
        }

        Object.values(this.source).forEach((entries) => {
            Object.entries(entries).forEach(([key, val]) => {
                if(key === 'genre' && this.genres.includes(val)){
                    if(results.get(val) === undefined) {
                        results.set(val, Array(entries));
                    } else {
                        results.get(val)?.push(entries);
                    }
                }
            })
        })
        
        return results;
    }

    filterByRefNr(refNr: string | null): GalleryItem | null {
        let result: GalleryItem | null = null;
        if(refNr !== null && refNr.length !== 6) {
            return null;
        }

        Object.values(this.source).forEach((entries) => {
            Object.entries(entries).forEach(([key, val]) => {
                if(key === 'referenceNr' && val === refNr) {
                    result = entries;
                }
            })
        })

        return result;
    }

    filterByRefNrForGenre(refNr: string): string {
        let result = '';
        if(refNr === '') {
            return '';
        }

        Object.values(this.source).forEach((entries) => {
            Object.entries(entries).forEach(([key, val]) => {
                if(key === 'referenceNr' && val === refNr) {
                    result = entries['genre'];
                }
            })
        })

        return result;
    }
}