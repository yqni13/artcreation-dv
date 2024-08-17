import { KeyValue } from "@angular/common";

export const ArtworkOptionEnum: KeyValue<number, string>[] = [
    { key: 0, value: 'original' },
    { key: 1, value: 'print' },
    { key: 2, value: 'original&print' },
    { key: 3, value: 'handcraft' },
];

export type ArtworkOptions = 'original' | 'print' | 'original&print' | 'handcraft';

export const ArtworkOptions = {
    original: 'original' as ArtworkOptions,
    print: 'print' as ArtworkOptions,
    originalANDprint: 'original&print' as ArtworkOptions,
    handcraft: 'handcraft' as ArtworkOptions,
}