/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject } from '@angular/core';
import { Injectable } from "@angular/core";
import { NewsUpdateStorage } from "../interfaces/NewsUpdateStorage";
import { NewsKeys } from "../enums/news-keys.enum";
import { default as newsData } from "../data/news-updates.json";
import { ErrorService } from "./error.service";
import { NewsItem } from '../../api/models/news-response.interface';
import { SortingOption } from '../enums/sorting-option.enum';

@Injectable({
    providedIn: 'root'
})
export class FilterNewsService {

    private source: NewsUpdateStorage[];
    private errorService: any

    constructor() {
        this.errorService = inject(ErrorService);
        this.source = [];
        
        try {
            this.setSource(newsData);
        } catch(err) {
            this.errorService.handle(err);
        }
    }

    private setSource(data: NewsUpdateStorage[]) {
        this.source = data;
    }    

    filterByKeyValueDEPRECATED(filterKey: NewsKeys | null): NewsUpdateStorage[] {
        const data = [...this.source];
        switch(filterKey) {
            case NewsKeys.dateAscending: {
                return data.sort((old, young) => {
                    return new Date(young.date).getTime() - new Date(old.date).getTime();
                })
            }
            case NewsKeys.dateDescending: {
                return data.sort((old, young) => {
                    return new Date(old.date).getTime() - new Date(young.date).getTime();
                })
            }
            default: {
                return data;
            }
        }
    }

    filterByKeyValue(filterKey: SortingOption | null, source: NewsItem[]): NewsItem[] {
        switch(filterKey) {
            case SortingOption.ASC: {
                return source.sort((old, young) => {
                    return new Date(young.created_on).getTime() - new Date(old.created_on).getTime();
                })
            }
            case SortingOption.DESC: {
                return source.sort((old, young) => {
                    return new Date(old.created_on).getTime() - new Date(young.created_on).getTime();
                })
            }
            default: {
                return source;
            }
        }
    }

    filterByCount(count: number, filterKey?: NewsKeys): NewsUpdateStorage[] {
        const data = [...this.filterByKeyValueDEPRECATED(filterKey || null)]
        if(count < data.length) {
            data.splice(count, data.length-1);
        }

        return data;
    }
}