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
        const response = await GalleryService.create(req.body, req.files);
        res.send(response);
    }

    update = async (req, res, next) => {
        checkValidation(req);
        const response = await GalleryService.update(req.body, req.files, req.validatedEntry);
        res.send(response);
    }

    delete = async (req, res, next) => {
        checkValidation(req);
        const response = await GalleryService.delete({id: req.params.id});
        res.send(response);
    }

    refNrPreview = async (req, res, next) => {
        checkValidation(req);
        const response = await GalleryService.refNrPreview({artGenre: req.params.artGenre});
        res.send(response);
    }
}

module.exports = new GalleryController();