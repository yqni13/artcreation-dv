export type ArtworkOptions = 'original' | 'print' | 'originalORprint' | 'handcraft';

export const ArtworkOptions = {
    original: 'original' as ArtworkOptions,
    print: 'print' as ArtworkOptions,
    originalORprint: 'originalORprint' as ArtworkOptions,
    handcraft: 'handcraft' as ArtworkOptions,
};

export const ArtworkOptionsOrigORPrint = {
    original: 'original' as ArtworkOptions,
    print: 'print' as ArtworkOptions
};

export const ArtworkOptionsHandcraftOnly = {
    handcraft: 'handcraft' as ArtworkOptions
}

export const ArtworkOptionsPaintingOnly = {
    original: 'original' as ArtworkOptions,
    print: 'print' as ArtworkOptions,
    originalORprint: 'originalORprint' as ArtworkOptions
}