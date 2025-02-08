const { basicResponse } = require('../utils/common.utils');
const GalleryModel = require('../models/gallery.model');
const GalleryRepository = require('../repositories/gallery.repository');
const AuthModel = require('../models/auth.model');

class GalleryService {
    findOne = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        // const acceptedToken = await AuthModel.checkToken(hasParams ? params : {});
        // params['accessToken'] = acceptedToken;
        const result = await GalleryRepository.findOne(hasParams ? params : {});
        return basicResponse(result, result.code, result.msg);
    }

    findAllFiltered = async (params) => {
        // TODO(yqni13): token security check!
        const hasParams = Object.keys(params).length !== 0;
        const result = await GalleryRepository.findAllFiltered(hasParams ? params : {});
        return basicResponse(result, result.code, result.msg);
    }

    findAll = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        // TODO(yqni13): token security check!
        const result = await GalleryRepository.findAll();
        return basicResponse(result, result.code, result.msg);
    }
    
    create = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        // const acceptedToken = await AuthModel.checkToken(hasParams ? params : {});
        // params['accessToken'] = acceptedToken;
        Object.assign(params, GalleryModel.createID()); // params['id']
        Object.assign(params, await GalleryModel.createRefNr(params)); // params['referenceNr']
        const result = await GalleryRepository.create(hasParams ? params : {});
        return basicResponse(result, result.code, result.msg);
    }

    update = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        // const acceptedToken = await AuthModel.checkToken(hasParams ? params : {});
        // params['accessToken'] = acceptedToken;
        params['referenceNr'] = await GalleryModel.checkGenreChange(params);
        const result = await GalleryRepository.update(hasParams ? params : {});
        return basicResponse(result, result.code, result.msg);
    }
}

module.exports = new GalleryService();