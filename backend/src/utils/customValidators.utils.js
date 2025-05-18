const { SaleStatus } = require('./enums/sale-status.enum');
const { ArtGenre } = require('./enums/art-genre.enum');
const { ArtMedium } = require('./enums/art-medium.enum');
const { ArtTechnique } = require('./enums/art-technique.enum');
const Secrets = require('../utils/secrets.utils');
const { decryptRSA } = require('../utils/crypto.utils');
const { InvalidPropertiesException } = require('./exceptions/validation.exception');

exports.validateSaleStatus = (value) => {
    const statusCollection = Object.values(SaleStatus);
    if(!statusCollection.includes(value)) {
        throw new Error('data-invalid-entry#saleStatus');
    }
    return true;
}

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

exports.validateRefNrNoManualChange = async (refNr, req) => {
    const entry = req.validatedEntry ?? null;
    if(!entry) {
        return true;
    }

    if(refNr.length !== 6) {
        throw new Error('data-invalid-length#referenceNr$6');
    }
    // as refNr changes, genre AND paths must be changed too, otherwise invalid
    if(refNr !== entry.reference_nr && (entry.art_genre === req.body.artGenre || !req.body.imagePath.includes(refNr))) {
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

exports.validateImageFileUpdate = (req, res, next) => {
    if(req.files.length > 0) {
        this.validateImageType(req.files[0]);
    }

    next();
}

exports.validateImageFileInput = (req, res, next) => {
    // custom solution file input => express-validator does not handle files
    if(req.body.galleryId === null && req.body.imagePath === null && req.files.length === 0) {
        const data = [{
            type: 'input',
            value: null,
            msg: 'image-required',
            path: 'imageFile',
            location: 'files'
        }];
        throw new InvalidPropertiesException('Missing or invalid properties', { data: data });
    }

    // validation not possible in case of news create/update with gallery link instead image
    if(req.files.length > 0) {
        this.validateImageType(req.files[0]);
    }

    next();
}

exports.validateImageType = (image) => {
    const type = image.mimetype.replace('image/', '');
    const validTypes = ['jpeg', 'jpg', 'webp', 'png']
    if(!validTypes.includes(type)) {
        const data = [{
            type: 'input',
            value: image.mimetype,
            msg: 'image-invalid-type',
            path: 'imageFile',
            location: 'files'
        }];
        throw new InvalidPropertiesException('Missing or invalid properties', { data: data });
    }
    return true;
}