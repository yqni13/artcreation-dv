const { basicResponse } = require('../utils/common.utils');
const AuthModel = require('../models/auth.model');
const GalleryModel = require('../models/gallery.model');
const GalleryRepository = require('../repositories/gallery.repository');
const NewsModel = require('../models/news.model');
const { createID } = require('../utils/common.utils');

class GalleryService {
    findOne = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const result = await GalleryRepository.findOne(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }

    findAll = async () => {
        const result = await GalleryRepository.findAll();
        return basicResponse(result.body, result.code, result.msg);
    }
    
    create = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        Object.assign(params, await createID(GalleryRepository, 'gallery')); // params['id']
        Object.assign(params, await GalleryModel.createRefNr(params)); // params['referenceNr']
        const result = await GalleryRepository.create(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }

    update = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        params['referenceNr'] = await GalleryModel.checkGenreChange(params);
        const result = await GalleryRepository.update(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }

    delete = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const constrain = await NewsModel.checkUseOfForeignKey(params);
        if(constrain.code === 0) {
            return basicResponse(constrain.body, constrain.code, constrain.msg);
        } 
        const result = constrain.body.proceedDeletion 
            ? await GalleryRepository.delete(hasParams ? params : {})
            : constrain;
        return basicResponse(result.body, result.code, result.msg);
    }
}

module.exports = new GalleryService();