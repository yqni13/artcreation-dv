export type NewsRoute = 'findOne' | 'findAllLeftJoin' | 'findAll' | 'create' | 'update' | 'delete';

export const NewsRoute = {
    FINDONE: 'findOne' as NewsRoute,
    FALEFTJOIN: 'findAllLeftJoin' as NewsRoute,
    FINDALL: 'findAll' as NewsRoute,
    CREATE: 'create' as NewsRoute,
    UPDATE: 'update' as NewsRoute,
    DELETE: 'delete' as NewsRoute,
}