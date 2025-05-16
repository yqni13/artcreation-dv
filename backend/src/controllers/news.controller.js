const { checkValidation } = require('../middleware/validation.middleware');
const NewsService = require('../services/news.service');

class NewsController {
    findOneWithGalleryPaths = async (req, res, next) => {
        checkValidation(req);
        const response = await NewsService.findOneWithGalleryPaths({id: req.params.id});
        res.send(response);
    }

    findAllWithGalleryPaths = async (req, res, next) => {
        const response = await NewsService.findAllWithGalleryPaths();
        res.send(response);
    }

    create = async (req, res, next) => {
        checkValidation(req);
        const response = await NewsService.create(req.body, req.files);
        res.send(response);
    }

    update = async (req, res, next) => {
        checkValidation(req);
        const response = await NewsService.update(req.body, req.files, req.validatedEntry);
        res.send(response);
    }

    delete = async (req, res, next) => {
        checkValidation(req);
        const response = await NewsService.delete({id: req.params.id});
        res.send(response);
    }

    /**
     * 
     * @deprecated Use findOneWithGalleryPaths instead. 
     */
    findOne = async (req, res, next) => {
        checkValidation(req);
        const response = await NewsService.findOne({id: req.params.id});
        res.send(response);
    }

    /**
     * 
     * @deprecated Use findAllWithGalleryPaths instead. 
     */
    findAll = async (req, res, next) => {
        const response = await NewsService.findAll();
        res.send(response);
    }
}

module.exports = new NewsController();