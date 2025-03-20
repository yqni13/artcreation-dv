import { ArtGenre } from "../../shared/enums/art-genre.enum";
import { ArtMedium } from "../../shared/enums/art-medium.enum";
import { ArtTechnique } from "../../shared/enums/art-technique.enum";
import { SaleStatus } from "../../shared/enums/sale-status.enum";

export const isArtGenre = (value: any): ArtGenre | null => {
    const enumVal = value ? (value as string).toUpperCase() : '';
    return Object.values(ArtGenre).includes(value) ? ArtGenre[(enumVal as any) as keyof typeof ArtGenre] : null;
};

export const isArtMedium = (value: any): ArtMedium | null => {
    const enumVal = value ? (value as string).toUpperCase() : '';
    return Object.values(ArtMedium).includes(value) ? ArtMedium[(enumVal as any) as keyof typeof ArtMedium] : null;
};

export const isArtTechnique = (value: any): ArtTechnique | null => {
    const enumVal = value ? (value as string).toUpperCase() : '';
    return Object.values(ArtTechnique).includes(value) ? ArtTechnique[(enumVal as any) as keyof typeof ArtTechnique] : null;
};

export const isSaleStatus = (value: any): SaleStatus | null => {
    const enumVal = value ? (value as string).toUpperCase() : '';
    return Object.values(SaleStatus).includes(value) ? SaleStatus[(enumVal as any) as keyof typeof SaleStatus] : null;
}