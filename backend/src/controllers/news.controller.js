const { checkValidation } = require('../middleware/validation.middleware');
const NewsService = require('../services/news.service');

class NewsController {
    findOne = async (req, res, next) => {
        checkValidation(req);
        const response = await NewsService.findOne({id: req.params.id});
        res.send(response);
    }

    findAllLeftJoin = async (req, res, next) => {
        const response = await NewsService.findAllLeftJoin();
        res.send(response);
    }

    findAll = async (req, res, next) => {
        const response = await NewsService.findAll();
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
}

module.exports = new NewsController();