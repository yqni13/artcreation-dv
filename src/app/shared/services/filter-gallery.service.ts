import { Injectable } from "@angular/core";
import { GalleryItem } from "../interfaces/GalleryItems";

@Injectable({
    providedIn: 'root'
})
export class FilterGalleryService {

    private genres: string[];

    constructor() {
        this.genres = [];
    }

    getGenres(data: GalleryItem[]): string[] {
        Object.values(data).forEach((entries) => {
            Object.entries(entries).forEach(([key, val]) => {
                if(key === 'genre' && !this.genres.includes(val)) {
                    this.genres.push(val);
                }
            })
        })
    
        return this.genres;
    }

    filterByGenre(data: GalleryItem[]): Map<string, GalleryItem[]> {
        const results = new Map<string, GalleryItem[]>()
        if(this.genres.length === 0) {
            return results;
        }

        Object.values(data).forEach((entries) => {
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
}