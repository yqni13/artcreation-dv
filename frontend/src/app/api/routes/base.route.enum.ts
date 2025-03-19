export type BaseRoute = '/admin' | '/about' | '/home' | '/gallery' | '/prints' | '/faq' | '/contact' | '/archive' | '/imprint' | '/login' | '/privacy' | '/shipping';

export const BaseRoute = {
    ABOUT: '/about' as BaseRoute,
    ADMIN: '/admin' as BaseRoute,
    ARCHIVE: '/archive' as BaseRoute,
    CONTACT: '/contact' as BaseRoute,
    FAQ: '/faq' as BaseRoute,
    GALLERY: '/gallery' as BaseRoute,
    HOME: '/home' as BaseRoute,
    IMPRINT: '/imprint' as BaseRoute,
    LOGIN: '/login' as BaseRoute,
    PRINTS: '/prints' as BaseRoute,
    PRIVACY: '/privacy' as BaseRoute,
    SHIPPING: '/shipping' as BaseRoute
}