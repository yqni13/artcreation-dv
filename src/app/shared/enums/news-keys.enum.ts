import { KeyValue } from "@angular/common";

export const NewsKeysEnum: KeyValue<number, string>[] = [
    { key: 0, value: 'date' },
    { key: 1, value: 'title' },
    { key: 2, value: 'text' },
    { key: 3, value: 'path' }
];

export type NewsKeys = 'date' | 'title' | 'text' | 'path';

export const NewsKeys = {
    date: 'date' as NewsKeys,
    title: 'title' as NewsKeys,
    text: 'text' as NewsKeys,
    path: 'path' as NewsKeys
};