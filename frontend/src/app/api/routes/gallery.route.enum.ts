
export type GalleryRoute = '/findOne' | '/findByRefNr' | '/findAll' | '/create' | '/update' | '/delete' | '/refNrPreview';

export const GalleryRoute = {
    FINDONE: '/findOne' as GalleryRoute,
    FINDBYREFNR: '/findByRefNr' as GalleryRoute,
    FINDALL: '/findAll' as GalleryRoute,
    CREATE: '/create' as GalleryRoute,
    UPDATE: '/update' as GalleryRoute,
    DELETE: '/delete' as GalleryRoute,
    REFNRPREVIEW: '/refNrPreview' as GalleryRoute
}