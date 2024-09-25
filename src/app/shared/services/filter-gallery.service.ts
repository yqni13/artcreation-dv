import { inject, Injectable } from "@angular/core";
import { GalleryItem } from "../interfaces/GalleryItems";
import { default as galleryData } from "../data/gallery-data.json";
import { ErrorService } from "./error.service";
import { PaintingGenre } from "../enums/painting-genre.enum";


@Injectable({
    providedIn: 'root'
})
export class FilterGalleryService {

    private source: GalleryItem[];
    private genres: string[];
    private errorService: ErrorService;

    constructor() {
        this.errorService = inject(ErrorService);
        this.source = [];
        this.genres = Object.values(PaintingGenre);
        this.genres = this.sortGenres('ascending');

        try {
            this.setSource(galleryData);
        } catch(err) {
            this.errorService.handle(err);
        }
    }

    private setSource(data: GalleryItem[]) {
        this.source = data;
    }
    
    sortGenres(sorting: string): string[] {
        if(this.genres.length === 0) {
            return [];
        }

        const data = [...this.genres];
        switch(sorting) {
            case('ascending'): {
                data.sort(function(a, b) {
                    const genreA = a.toUpperCase();
                    const genreB = b.toUpperCase();
                    return (genreA < genreB) ? -1 : (genreA > genreB) ? 1 : 0;
                })
                break;
            }
            case('descending'): {
                data.sort(function(a, b) {
                    const genreA = a.toUpperCase();
                    const genreB = b.toUpperCase();
                    return (genreA > genreB) ? -1 : (genreA < genreB) ? 1 : 0;
                })
                break;
            }
            default:
                return this.genres;
        }
        return data;
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