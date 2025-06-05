const { basicResponse } = require('../utils/common.utils');
const Utils = require('../utils/common.utils');
const NewsModel = require('../models/news.model');
const NewsRepository = require('../repositories/news.repository');
const ImgUploadModel = require('../models/image-upload.model');

class NewsService {
    findOneWithGalleryPaths = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const result = await NewsRepository.findOneWithGalleryPaths(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }

    findAllWithGalleryPaths = async () => {
        const result = await NewsRepository.findAllWithGalleryPaths();
        return basicResponse(result.body, result.code, result.msg);
    }

    create = async (params, files) => {
        const hasParams = Object.keys(params).length !== 0;
        Object.assign(params, await Utils.createID(NewsRepository, 'news')); // params['id']
        if(files.length > 0) {
            params = NewsModel.renamePathNames(params, 'placeholder', params.id);
            files = Utils.renameFileNames(files, ['placeholder'], [params.id]);
            await ImgUploadModel.handleImageUploads(params, files);
        }
        const result = await NewsRepository.create(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }

    update = async (params, files, compareData) => {
        const hasParams = Object.keys(params).length !== 0;
        params = NewsModel.renamePathNames(params, 'placeholder', params.id);
        files = Utils.renameFileNames(files, ['placeholder'], [params.id]);
        await NewsModel.checkForImageUpdate(params, files, compareData);
        const result = await NewsRepository.update(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }

    delete = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const pathData = await Utils.getEntryImagePaths(NewsRepository, params);
        if(pathData.imagePath !== null && pathData.thumbnailPath !== null) {
            await ImgUploadModel.handleImageRemoval(pathData);
        }
        const result = await NewsRepository.delete(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }

    /**
     * 
     * @deprecated Use findOneWithGalleryPaths instead. 
     */
    findOne = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const result = await NewsRepository.findOne(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }

    /**
     * 
     * @deprecated Use findAllWithGalleryPaths instead. 
     */
    findAll = async () => {
        const result = await NewsRepository.findAll();
        return basicResponse(result.body, result.code, result.msg);
    }
}

module.exports = new NewsService();