export type SaleStatus = 'available' | 'reserved' | 'sold' | 'unavailable';

export const SaleStatus = {
    AVAILABLE: 'available' as SaleStatus,
    RESERVED: 'reserved' as SaleStatus,
    SOLD: 'sold' as SaleStatus,
    UNAVAILABLE: 'unavailable' as SaleStatus
}