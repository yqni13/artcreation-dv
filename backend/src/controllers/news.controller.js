const { checkValidation } = require('../middleware/validation.middleware');
const NewsService = require('../services/news.service');

class NewsController {
    findOne = async (req, res, next) => {
        checkValidation(req);
        const response = await NewsService.findOne(req.body);
        res.send(response);
    }

    findAll = async (req, res, next) => {
        checkValidation(req);
        const response = await NewsService.findAll(req.body);
        res.send(response);
    }

    create = async (req, res, next) => {
        checkValidation(req);
        const response = await NewsService.create(req.body);
        res.send(response);
    }

    update = async (req, res, next) => {
        checkValidation(req);
        const response = await NewsService.update(req.body);
        res.send(response);
    }

    delete = async (req, res, next) => {
        checkValidation(req);
        const response = await NewsService.delete(req.body);
        res.send(response);
    }
}

module.exports = new NewsController();