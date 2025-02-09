const { basicResponse } = require('../utils/common.utils');
const AuthModel = require('../models/auth.model');
const GalleryModel = require('../models/gallery.model');
const GalleryRepository = require('../repositories/gallery.repository');
const NewsModel = require('../models/news.model');
const { createID } = require('../utils/common.utils');

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
        const result = await GalleryRepository.findAll(hasParams ? params : {});
        return basicResponse(result, result.code, result.msg);
    }
    
    create = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        // const acceptedToken = await AuthModel.checkToken(hasParams ? params : {});
        // params['accessToken'] = acceptedToken;
        Object.assign(params, await createID(GalleryRepository, 'gallery')); // params['id']
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

    delete = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        // const acceptedToken = await AuthModel.checkToken(hasParams ? params : {});
        // params['accessToken'] = acceptedToken;
        const constrain = await NewsModel.checkUseOfForeignKey(params);
        if(constrain.code === 0) {
            return basicResponse(constrain, constrain.code, constrain.msg);
        } 
        const result = constrain.proceedDeletion 
            ? await GalleryRepository.delete(hasParams ? params : {})
            : constrain;
        return basicResponse(result, result.code, result.msg);
    }
}

module.exports = new GalleryService();