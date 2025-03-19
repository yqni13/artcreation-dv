const { basicResponse } = require('../utils/common.utils');
const GalleryModel = require('../models/gallery.model');
const GalleryRepository = require('../repositories/gallery.repository');
const ImgUploadModel = require('../models/image-upload.model');
const NewsModel = require('../models/news.model');
const { createID, getEntryImagePaths } = require('../utils/common.utils');

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
    
    create = async (params, files) => {
        const hasParams = Object.keys(params).length !== 0;
        Object.assign(params, await createID(GalleryRepository, 'gallery')); // params['id']
        Object.assign(params, await GalleryModel.createRefNr(params)); // params['referenceNr']
        const imgUpload = await ImgUploadModel.handleImageUploads(params, files);
        if(imgUpload.error) {
            return basicResponse(imgUpload.error, imgUpload.code, imgUpload.msg);
        }
        const result = await GalleryRepository.create(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }

    update = async (params, files) => {
        const hasParams = Object.keys(params).length !== 0;
        params['referenceNr'] = await GalleryModel.checkGenreChange(params);
        const imgUpdate = await ImgUploadModel.handleImageUpdate(params, files);
        if(imgUpdate.error) {
            return basicResponse(imgUpdate.body, imgUpdate.code, imgUpdate.msg);
        }
        const result = await GalleryRepository.update(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }

    delete = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const constrain = await NewsModel.checkUseOfForeignKey(params);

        if(constrain.body.proceedDeletion) {
            const pathData = await getEntryImagePaths(GalleryRepository, params);
            const imgDelete = await ImgUploadModel.handleImageRemoval(pathData);
            const result = imgDelete.body.error ? null : await GalleryRepository.delete(hasParams ? params : {});
            return imgDelete.body.error
                ? basicResponse(imgDelete.body, imgDelete.code, imgDelete.msg)
                : basicResponse(result.body, result.code, result.msg);
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