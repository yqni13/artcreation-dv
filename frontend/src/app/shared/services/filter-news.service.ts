import { Injectable } from "@angular/core";
import { NewsItem, NewsItemWGP } from '../../api/models/news-response.interface';
import { SortingOption } from '../enums/sorting-option.enum';

@Injectable({
    providedIn: 'root'
})
export class FilterNewsService {

    constructor() {
        //
    }   

    filterByKeyValue(filterKey: SortingOption | null, source: NewsItem[] | NewsItemWGP[]): NewsItem[] | NewsItemWGP[] {
        filterKey = filterKey === null ? SortingOption.DESC : filterKey;
        source = source.sort(
            (old, young) => {
                return filterKey === SortingOption.DESC
                ? new Date(young.created_on).getTime() - new Date(old.created_on).getTime()
                : new Date(old.created_on).getTime() - new Date(young.created_on).getTime();
            }
        );
        return source;
    }

    filterByCount(count: number, source: NewsItem[] | NewsItemWGP[], filterKey?: SortingOption): NewsItem[] | NewsItemWGP[] {
        if(source.length === 0) {
            return source;
        }
        const data = [...this.filterByKeyValue(filterKey || null, source)]
        if(count < data.length) {
            data.splice(count, data.length-1);
        }

        return data;
    }
}