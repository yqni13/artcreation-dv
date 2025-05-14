const { basicResponse } = require('../utils/common.utils');
const Utils = require('../utils/common.utils');
const NewsModel = require('../models/news.model');
const NewsRepository = require('../repositories/news.repository');
const ImgUploadModel = require('../models/image-upload.model');

class NewsService {
    findOne = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const result = await NewsRepository.findOne(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }
    
    findAll = async () => {
        const result = await NewsRepository.findAll();
        return basicResponse(result.body, result.code, result.msg);
    }
    
    create = async (params, files) => {
        const hasParams = Object.keys(params).length !== 0;
        Object.assign(params, await Utils.createID(NewsRepository, 'news')); // params['id']
        params = NewsModel.renamePathName(params, 'placeholder', params.id);
        files = NewsModel.renameFileName(files, 'placeholder', params.id);
        await ImgUploadModel.handleImageUploads(params, files);
        const result = await NewsRepository.create(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }
    
    update = async (params, files, compareData) => {
        const hasParams = Object.keys(params).length !== 0;
        params = NewsModel.renamePathName(params, 'placeholder', params.id);
        files = NewsModel.renameFileName(files, 'placeholder', params.id);
        await ImgUploadModel.handleImageUpdate(params, files, compareData);
        const result = await NewsRepository.update(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }
    
    delete = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const result = await NewsRepository.delete(hasParams ? params : {});
        return basicResponse(result.body, result.code, result.msg);
    }
}

module.exports = new NewsService();