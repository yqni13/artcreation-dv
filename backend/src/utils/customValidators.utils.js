const { ArtGenre } = require('./enums/art-genre.enum');
const { ArtMedium } = require('./enums/art-medium.enum');
const { ArtTechnique } = require('./enums/art-technique.enum');
const { ArtType } = require('./enums/art-type.enum');

exports.validateArtGenre = (value) => {
    const genres = Object.values(ArtGenre);
    if(!genres.includes(value)) {
        throw new Error('backend-art-genre');
    }
    return true;
};

exports.validateArtMedium = (value) => {
    const genres = Object.values(ArtMedium);
    if(!genres.includes(value)) {
        throw new Error('backend-art-medium');
    }
    return true;
};

exports.validateArtTechnique = (value) => {
    const genres = Object.values(ArtTechnique);
    if(!genres.includes(value)) {
        throw new Error('backend-art-technique');
    }
    return true;
};

exports.validateArtType = (value) => {
    const types = Object.values(ArtType);
    if(!types.includes(value)) {
        throw new Error('backend-art-type')
    }
    return true;
};

exports.validateUUID = (value) => {
    const pureValue = value.replaceAll('-', '');
    if(pureValue.length !== 32) {
        throw new Error('backend-invalid-uuid');
    }
    return true;
}