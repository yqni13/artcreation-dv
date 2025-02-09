const { basicResponse } = require('../utils/common.utils');
const { createID } = require('../utils/common.utils');
const AuthModel = require('../models/auth.model');
const NewsRepository = require('../repositories/news.repository');

class NewsService {
    findOne = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        // const acceptedToken = await AuthModel.checkToken(hasParams ? params : {});
        // params['accessToken'] = acceptedToken;
        const result = await NewsRepository.findOne(hasParams ? params : {});
        return basicResponse(result, result.code, result.msg);
    }
    
    findAll = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        // const acceptedToken = await AuthModel.checkToken(hasParams ? params : {});
        // params['accessToken'] = acceptedToken;
        const result = await NewsRepository.findAll(hasParams ? params : {});
        return basicResponse(result, result.code, result.msg);
    }
    
    create = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        // const acceptedToken = await AuthModel.checkToken(hasParams ? params : {});
        // params['accessToken'] = acceptedToken;
        Object.assign(params, await createID(NewsRepository, 'news'));
        const result = await NewsRepository.create(hasParams ? params : {});
        return basicResponse(result, result.code, result.msg);
    }
    
    update = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        // const acceptedToken = await AuthModel.checkToken(hasParams ? params : {});
        // params['accessToken'] = acceptedToken;
        const result = await NewsRepository.update(hasParams ? params : {});
        return basicResponse(result, result.code, result.msg);
    }
    
    delete = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        // const acceptedToken = await AuthModel.checkToken(hasParams ? params : {});
        // params['accessToken'] = acceptedToken;
        const result = await NewsRepository.delete(hasParams ? params : {});
        return basicResponse(result, result.code, result.msg);
    }
}

module.exports = new NewsService();