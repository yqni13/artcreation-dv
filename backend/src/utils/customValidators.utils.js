const { RoutesEnum } = require('./enums/routes.enum');
const Secrets = require('../utils/secrets.utils');
const { decryptRSA } = require('../utils/crypto.utils');
const Utils = require('./common.utils');

exports.validateEnum = (value, enumObj, enumName) => {
    const enumValues = Object.values(enumObj);
    if(!enumValues.includes(value)) {
        throw new Error(`data-invalid-entry#${enumName}`);
    }
    return true;
}

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

exports.validateNewsFK = async (fk, repositorySK, req) => {
    if(fk === null || fk === undefined) {
        return true;
    }
    this.validateUUID(fk);
    await this.validateExistingEntry(fk, repositorySK, req);
    return true;
}

exports.validateNewsImages = (img, fk) => {
    if(fk === null && (img === null || img === undefined)) {
        throw new Error('data-required');
    } else if((fk !== null && fk !== undefined) && img !== null && img !== undefined) {
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

exports.validateImageFileInput = (req) => {
    // custom error to handle file validation => express-validator does not validate files
    const customError = [{
        type: 'input',
        value: null,
        msg: 'image-required',
        path: 'imageFile',
        location: 'files'
    }];

    // Isolate the string '/api/<version>/' to get route from baseUrl.
    const route = req.baseUrl.replace(req.baseUrl.substring(-1, req.baseUrl.lastIndexOf('/')+1), '');
    const hasImgChange = req.validatedEntry && req.validatedEntry.image_path !== req.body.imagePath && (req.body.imagePath !== null && req.body.imagePath !== undefined);
    if(route === RoutesEnum.NEWS && (req.body.galleryId === null || req.body.galleryId === undefined) && req.files.length <= 0 && hasImgChange) {
        req = Utils.alarmCustomError(req, customError);
    } else if(req.files.length <= 0 && (!req.validatedEntry || hasImgChange)) {
        req = Utils.alarmCustomError(req, customError);
    }

    // validate type only in case of new image input (create/input img upload)
    if(req.files.length > 0) {
        req = this.validateImageType(req.files[0], req);
    }

    return true;
}

exports.validateImageType = (image, req) => {
    const type = image.mimetype.replace('image/', '');
    const validTypes = ['jpeg', 'jpg', 'webp', 'png']
    if(!validTypes.includes(type)) {
        const customError = [{
            type: 'input',
            value: image.mimetype,
            msg: 'image-invalid-type',
            path: 'imageFile',
            location: 'files'
        }];
        req = Utils.alarmCustomError(req, customError);
    }
    return true;
}