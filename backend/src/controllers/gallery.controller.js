const GalleryService = require('../services/gallery.service');
const { checkValidation } = require('../middleware/validation.middleware');

class GalleryController {
    async findOne(req, res, next) {
        checkValidation(req);
        const response = await GalleryService.findOne({id: req.params.id});
        res.send(response);
    }

    async findByRefNr(req, res, next) {
        checkValidation(req);
        const response = await GalleryService.findByRefNr({reference_nr: req.params.refNr});
        res.send(response);
    }

    async findAll(req, res, next) {
        const response = await GalleryService.findAll();
        res.send(response);
    }

    async create(req, res, next) {
        checkValidation(req);
        const response = await GalleryService.create(req.body, req.files);
        res.send(response);
    }

    async update(req, res, next) {
        checkValidation(req);
        const response = await GalleryService.update(req.body, req.files, req.validatedEntry);
        res.send(response);
    }

    async delete(req, res, next) {
        checkValidation(req);
        const response = await GalleryService.delete({id: req.params.id});
        res.send(response);
    }

    async refNrPreview(req, res, next) {
        checkValidation(req);
        const response = await GalleryService.refNrPreview({artGenre: req.params.artGenre});
        res.send(response);
    }
}

module.exports = new GalleryController();