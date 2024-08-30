import { Injectable } from "@angular/core";
import { GalleryItem } from "../interfaces/GalleryItems";
import { ArtworkOptions } from "../enums/artwork-option.enum";
import { default as galleryData } from "../data/gallery-data.json";

@Injectable({
    providedIn: 'root'
})
export class ReferenceCheckService {

    private source: GalleryItem[]
    private referenceCollection: Record<string, ArtworkOptions>;

    constructor() {
        this.source = [];
        this.referenceCollection = {};

        try {
            this.setSource(galleryData);
            this.setReferenceCollection();
        } catch(err) {
            console.log('Reference Service failed to initialize necessary data.', err);
        }        
    }

    private setSource(data: GalleryItem[]) {
        if(data === null || data === undefined || data.length === 0) {
            return;
        }

        this.source = data;
    }

    private setReferenceCollection() {
        if(this.source?.length === 0) {
            return;
        }

        Object.values(this.source).forEach((entries) => {
            let ref = '';
            let type = null;
            Object.entries(entries).forEach(([key, val]) => {
                if(key === 'referenceNr') {
                    ref = val;
                }
                if(key === 'type') {
                    type = val;
                }
            })
            Object.assign(this.referenceCollection, {[ref]: type});
        })
    }

    checkReferenceValidity(reference: string): boolean {
        return Object.keys(this.referenceCollection).includes(reference.toUpperCase());
    }

    checkTypeByReference(reference: string): ArtworkOptions | null {
        reference = reference.toUpperCase();
        if(!Object.keys(this.referenceCollection).includes(reference)) {
            return null;
        }

        return this.referenceCollection[reference];
    } 
}