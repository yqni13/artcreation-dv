const GalleryService = require('../services/gallery.service');
const { checkValidation } = require('../middleware/validation.middleware');

class GalleryController {
    findOne = async (req, res, next) => {
        checkValidation(req);
        const response = await GalleryService.findOne(req.body);
        res.send(response);
    }

    create = async (req, res, next) => {
        checkValidation(req);
        const response = await GalleryService.create(req.body);
        res.send(response);
    }
}

module.exports = new GalleryController();