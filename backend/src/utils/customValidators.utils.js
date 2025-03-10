const { ArtGenre } = require('./enums/art-genre.enum');
const { ArtMedium } = require('./enums/art-medium.enum');
const { ArtTechnique } = require('./enums/art-technique.enum');
const Secrets = require('../utils/secrets.util');
const { decryptRSA } = require('../utils/crypto.utils');

exports.validateArtGenre = (value) => {
    const genres = Object.values(ArtGenre);
    if(!genres.includes(value)) {
        throw new Error('data-invalid-entry#artGenre');
    }
    return true;
};

exports.validateArtMedium = (value) => {
    const genres = Object.values(ArtMedium);
    if(!genres.includes(value)) {
        throw new Error('data-invalid-entry#artMedium');
    }
    return true;
};

exports.validateArtTechnique = (value) => {
    const genres = Object.values(ArtTechnique);
    if(!genres.includes(value)) {
        throw new Error('data-invalid-entry#artTechnique');
    }
    return true;
};

exports.validateUUID = (value) => {
    const pureValue = value.replaceAll('-', '');
    if(pureValue.length !== 32) {
        throw new Error('data-invalid-length#uuid$32');
    }
    return true;
}

exports.validateRefNrNoManualChange = async (refNr, req, repository) => {
    const entry = req.validatedEntry ?? null;
    if(!entry) {
        return true;
    }

    if(refNr.length !== 6) {
        throw new Error('data-invalid-length#referenceNr$6');
    }
    if(refNr !== entry.reference_nr) {
        throw new Error('data-invalid-entry#referenceNr');
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
        throw new Error('data-required');
    } else if(fk !== null && img !== null && img !== undefined) {
        throw new Error('data-invalid-entry#path')
    }
    return true;
}

exports.validateDateTime = (datetime) => {
    const convert = new Date(datetime);
    if(convert === undefined || convert === null) {
        throw new Error('data-invalid-entry#datetime');
    }
    return true;
}

exports.validateExistingEntry = async (id, repository, req) => {
    const result = await repository.findOne({id: id});
    if(result.code === 0 || result.body.data === null) {
        throw new Error('data-404-entry#id');
    }
    req.validatedEntry = result.body.data;
    return true;
}

exports.validateEncryptedSender = (encryptedSender) => {
    const decryptedSender = decryptRSA(encryptedSender, Secrets.PRIVATE_KEY);
    if(!decryptedSender.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        throw new Error('data-invalid-email');
    }

    return true;
}