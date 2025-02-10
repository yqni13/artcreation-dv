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
        console.log("pureValue from validateUUID: ", pureValue);
        throw new Error('backend-invalid-uuid');
    }
    return true;
}

exports.validateRefNrNoManualChange = async (refNr, id, repository) => {
    const entry = await repository.findOne({id: id});
    if(refNr !== entry.body.data.reference_nr || refNr.length !== 6) {
        throw new Error('backend-invalid-referenceNr');
    }
    return true;
}

exports.validateNewsFK = (fk) => {
    if(fk === null) {
        return true;
    }
    this.validateUUID(fk);
    return true;
}

exports.validateNewsImages = (img, fk) => {
    if(fk === null && (img === null || img === undefined)) {
        throw new Error('backend-news-missing-img');
    } else if(fk !== null && img !== null && img !== undefined) {
        throw new Error('backend-news-overload-img')
    }
    return true;
}

exports.validateDateTime = (datetime) => {
    const convert = new Date(datetime);
    if(convert === undefined || convert === null) {
        throw new Error('backend-invalid-datetime');
    }
    return true;
}