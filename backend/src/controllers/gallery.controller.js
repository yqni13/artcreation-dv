const GalleryService = require('../services/gallery.service');
const { checkValidation } = require('../middleware/validation.middleware');

class GalleryController {
    findOne = async (req, res, next) => {
        checkValidation(req);
        const response = await GalleryService.findOne({id: req.params.id});
        res.send(response);
    }

    findAll = async (req, res, next) => {
        const response = await GalleryService.findAll();
        res.send(response);
    }

    create = async (req, res, next) => {
        checkValidation(req);
        const response = await GalleryService.create(req.body);
        res.send(response);
    }

    update = async (req, res, next) => {
        checkValidation(req);
        const response = await GalleryService.update(req.body);
        res.send(response);
    }

    delete = async (req, res, next) => {
        checkValidation(req);
        const response = await GalleryService.delete(req.body);
        res.send(response);
    }
}

module.exports = new GalleryController();