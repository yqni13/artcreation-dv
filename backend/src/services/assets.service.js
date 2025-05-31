const { basicResponse } = require('../utils/common.utils');
const AssetsRepository = require('../repositories/assets.repository');
const AssetsModel = require('../models/assets.model');
const ImgUploadModel = require('../models/image-upload.model');
const Utils = require('../utils/common.utils');

class AssetsService {
    findOne = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const result = await AssetsRepository.findOne(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }

    findAll = async () => {
        const result = await AssetsRepository.findAll();
        return basicResponse(result.body, result.code, result.msg);
    }

    create = async (params, files) => {
        const hasParams = Object.keys(params).length !== 0;
        Object.assign(params, await Utils.createID(AssetsRepository, 'assets'))
        params = AssetsModel.renamePathNames(params, 'placeholder', params.id);
        files = Utils.renameFileNames(files, ['placeholder'], [params.id]);
        await ImgUploadModel.handleImageUploads(params, files);
        const result = await AssetsRepository.create(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }

    update = async (params, files, compareData) => {
        const hasParams = Object.keys(params).length !== 0;
        await ImgUploadModel.handleImageUpdate(params, files, compareData);
        const result = await AssetsRepository.update(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }

    delete = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const pathData = await Utils.getEntryImagePaths(AssetsRepository, params);
        if(pathData.imagePath !== null && pathData.thumbnailPath !== null) {
            await ImgUploadModel.handleImageRemoval(pathData);
        }
        const result = await AssetsRepository.delete(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }
}

module.exports = new AssetsService();