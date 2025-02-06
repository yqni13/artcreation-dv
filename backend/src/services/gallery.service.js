const { basicResponse } = require('../utils/common.utils');
const GalleryModel = require('../models/gallery.model');
const GalleryRepository = require('../repositories/gallery.repository');
const AuthModel = require('../models/auth.model');

class GalleryService {
    msg = '';

    constructor() {
        msg = 'Success';
    }

    findOne = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const acceptedToken = await AuthModel.checkToken(hasParams ? params : {});
        params['accessToken'] = acceptedToken;
        const data = await GalleryRepository.findOne(hasParams ? params : {});
        return basicResponse(data, 1, msg);
    }

    create = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const acceptedToken = await AuthModel.checkToken(hasParams ? params : {});
        params['accessToken'] = acceptedToken;
        const data = await GalleryRepository.create(hasParams ? params : {});
        return basicResponse(data, 1, msg);
    }
}

module.exports = new GalleryService();