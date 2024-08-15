import { KeyValue } from "@angular/common";

export const PaintingOptionEnum: KeyValue<number, string>[] = [
    { key: 0, value: 'original' },
    { key: 1, value: 'print' },
    { key: 2, value: 'both' },
];

export type PaintingOptions = 'original' | 'print' | 'both';

export const PaintingOptions = {
    original: 'original' as PaintingOptions,
    print: 'print' as PaintingOptions,
    both: 'both' as PaintingOptions,
}