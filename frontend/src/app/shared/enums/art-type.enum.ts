export type ArtType = 'original' | 'print' | 'originalORprint' | 'handcraft';

export const ArtType = {
    original: 'original' as ArtType,
    print: 'print' as ArtType,
    originalORprint: 'originalORprint' as ArtType,
    handcraft: 'handcraft' as ArtType,
};

export const ArtTypeOrigORPrint = {
    original: 'original' as ArtType,
    print: 'print' as ArtType
};

export const ArtTypeHandcraftOnly = {
    handcraft: 'handcraft' as ArtType
};

export const ArtTypePaintingOnly = {
    original: 'original' as ArtType,
    print: 'print' as ArtType,
    originalORprint: 'originalORprint' as ArtType
};