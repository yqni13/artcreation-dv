import { ArtGenre } from "../../shared/enums/art-genre.enum";
import { ArtMedium } from "../../shared/enums/art-medium.enum";
import { ArtTechnique } from "../../shared/enums/art-technique.enum";

export const getArtGenre = (value: any): ArtGenre | null => {
    return Object.values(ArtGenre).includes(value) ? ArtGenre[value as keyof typeof ArtGenre] : null;
};

export const isArtMedium = (value: any): ArtMedium | null => {
    return Object.values(ArtMedium).includes(value) ? ArtMedium[value as keyof typeof ArtMedium] : null;
};

export const isArtTechnique = (value: any): ArtTechnique | null => {
    return Object.values(ArtTechnique).includes(value) ? ArtTechnique[value as keyof typeof ArtTechnique] : null;
};