import { Injectable } from "@angular/core";
import { GalleryItem } from "../interfaces/GalleryItems";
import { ArtType } from "../enums/art-type.enum";
import { default as galleryData } from "../data/gallery-data.json";

@Injectable({
    providedIn: 'root'
})
export class ReferenceCheckService {

    private source: GalleryItem[]
    private referenceCollection: Record<string, {type: ArtType, sale: boolean, price: number|null}>;

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
            let price = null;
            Object.entries(entries).forEach(([key, val]) => {
                if(key === 'referenceNr') {
                    ref = val;
                }
                if(key === 'type') {
                    type = val;
                }
                if(key === 'price' && val !== null && val !== 0) {
                    price = val;
                }
            })
            Object.assign(this.referenceCollection, {[ref]: {type: type, sale: price ? true : false, price: price}});
        })
    }

    checkSaleStatusByReference(reference: string): boolean | null {
        reference = reference.toUpperCase();
        if(!Object.keys(this.referenceCollection).includes(reference)) {
            return null;
        }

        return this.referenceCollection[reference]['sale'];
    }

    checkPriceByReference(reference: string): number | null {
        reference = reference.toUpperCase();
        if(!Object.keys(this.referenceCollection).includes(reference)) {
            return null;
        }

        return this.referenceCollection[reference]['price'];
    }

    checkReferenceValidity(reference: string): boolean {
        return Object.keys(this.referenceCollection).includes(reference.toUpperCase());
    }

    checkTypeByReference(reference: string): ArtType | null {
        reference = reference.toUpperCase();
        if(!Object.keys(this.referenceCollection).includes(reference)) {
            return null;
        }

        return this.referenceCollection[reference]['type'];
    } 
}