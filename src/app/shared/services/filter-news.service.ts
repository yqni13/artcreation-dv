/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
import { NewsUpdateStorageItem } from "../interfaces/NewsUpdateStorage";
import { NewsKeys } from "../enums/news-keys.enum";

@Injectable({
    providedIn: 'root'
})
export class FilterNewsService {

    private count: number;
    private source: NewsUpdateStorageItem;

    constructor() {
        this.count = 0;
        this.source = {};
    }

    setCount(entry: number) {
        this.count = entry;
    }

    setSource(data: NewsUpdateStorageItem) {
        this.source = data;
    }    

    filterByKeyValue(filterKey: NewsKeys): NewsUpdateStorageItem {
        // get all keys sorted by selected key
        const dict: any[] = [];
        switch(filterKey) {
            case NewsKeys.date: {
                Object.entries(this.source).forEach(([key, value]) => {
                    dict.push({ key: key, date: Date.parse(value.date) });
                })
                dict.sort((old, young) => { return young.date - old.date});
                break;
            }
            default: {
                return this.source;
            }
        }
        
        // sort out number of displayed news
        const result: NewsUpdateStorageItem = {};
        if(this.count < dict.length) {
            dict.splice(this.count,dict.length-1);
        }
        for(const entry of Object.values(dict)) {
            Object.assign(result, {[entry.key]: (this.source[entry.key])});
        }

        return result;
    }
}