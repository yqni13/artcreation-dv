export type NewsRoute = 'findOne' | 'findOneWithGalleryPaths' | 'findAll' | 'findAllWithGalleryPaths' | 'create' | 'update' | 'delete';

export const NewsRoute = {
    FINDONEWGP: 'findOneWithGalleryPaths' as NewsRoute,
    FINDALLWGP: 'findAllWithGalleryPaths' as NewsRoute,
    CREATE: 'create' as NewsRoute,
    UPDATE: 'update' as NewsRoute,
    DELETE: 'delete' as NewsRoute,
    
    FINDONE_Deprecated: 'findOne' as NewsRoute,
    FINDALL_Deprecated: 'findAll' as NewsRoute,
}