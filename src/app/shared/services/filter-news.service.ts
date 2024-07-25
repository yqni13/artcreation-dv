import { Injectable } from "@angular/core";
import { NewsUpdateStorageItem } from "../interfaces/NewsUpdateStorage";

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

    filterByTimestamp(): NewsUpdateStorageItem {
        // get all keys sorted by date
        const dict: { key: string; date: number; }[] = [];
        Object.entries(this.source).forEach(([key, value]) => {
            dict.push({ key: key, date: Date.parse(value.date) });
        })
        dict.sort((old, young) => { return young.date - old.date});
        
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