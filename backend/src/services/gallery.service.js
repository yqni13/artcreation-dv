const { basicResponse } = require('../utils/common.utils');
const GalleryModel = require('../models/gallery.model');
const GalleryRepository = require('../repositories/gallery.repository');
const ImgUploadModel = require('../models/image-upload.model');
const NewsModel = require('../models/news.model');
const Utils = require('../utils/common.utils');

class GalleryService {
    findOne = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const result = await GalleryRepository.findOne(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }

    findByRefNr = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        params = await GalleryModel.parseGalleryRefParams(params);
        const result = await GalleryRepository.findAllFiltered(hasParams ? params : {});
        return basicResponse(result, result.error ? 0 : 1, result.error ? 'Error' : 'Success');
    }

    findAll = async () => {
        const result = await GalleryRepository.findAll();
        return basicResponse(result.body, result.code, result.msg);
    }
    
    create = async (params, files) => {
        const hasParams = Object.keys(params).length !== 0;
        Object.assign(params, await Utils.createID(GalleryRepository, 'gallery')); // params['id']
        Object.assign(params, await GalleryModel.createRefNr(params)); // params['referenceNr']
        await ImgUploadModel.handleImageUploads(params, files);
        const result = await GalleryRepository.create(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }

    update = async (params, files, compareData) => {
        const hasParams = Object.keys(params).length !== 0;
        params['referenceNr'] = await GalleryModel.checkGenreChange(params);
        await ImgUploadModel.handleImageUpdate(params, files, compareData);
        const result = await GalleryRepository.update(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }

    delete = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const constrain = await NewsModel.checkUseOfForeignKey(params);

        if(constrain.body.proceedDeletion) {
            const pathData = await Utils.getEntryImagePaths(GalleryRepository, params);
            await ImgUploadModel.handleImageRemoval(pathData);
            const result = await GalleryRepository.delete(hasParams ? params : {});
            return basicResponse(result.body, result.code, result.msg);
        }
        return basicResponse(constrain.body, constrain.code, constrain.msg);
    }

    refNrPreview = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const refNr = await GalleryModel.createRefNr(hasParams ? params : {});
        return basicResponse(refNr, 1, 'Success');
    }
}

module.exports = new GalleryService();