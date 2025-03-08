const { ArtGenre } = require('./enums/art-genre.enum');
const { ArtMedium } = require('./enums/art-medium.enum');
const { ArtTechnique } = require('./enums/art-technique.enum');
const { InvalidPropertiesException } = require('../utils/exceptions/validation.exception');
const Secrets = require('../utils/secrets.util');
const { decryptRSA } = require('../utils/crypto.utils');

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

exports.validateUUID = (value) => {
    const pureValue = value.replaceAll('-', '');
    if(pureValue.length !== 32) {
        throw new Error('backend-invalid-uuid');
    }
    return true;
}

exports.validateRefNrNoManualChange = async (refNr, id, repository) => {
    if(refNr.length !== 6) {
        throw new Error('backend-length-refNr');
    }
    const entry = await repository.findOne({id: id});
    if(refNr !== entry.body.data.reference_nr) {
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

exports.validateExistingEntry = async (id, repository) => {
    const result = await repository.findOne({id: id});
    if(result.code === 0 || result.body.data === null) {
        throw new Error('backend-entry-404');
    }
    return true;
}

exports.validateEncryptedSender = (encryptedSender) => {
    const decryptedSender = decryptRSA(encryptedSender, Secrets.PRIVATE_KEY);
    if(!decryptedSender.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        throw new InvalidPropertiesException('data-invalid-email');
    }

    return true;
}