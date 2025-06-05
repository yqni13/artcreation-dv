const AssetsService = require('../services/assets.service');
const { checkValidation } = require('../middleware/validation.middleware');

class AssetsController {
    findOne = async (req, res, next) => {
        checkValidation(req);
        const response = await AssetsService.findOne({id: req.params.id});
        res.send(response);
    }

    findAll = async (req, res, next) => {
        const response = await AssetsService.findAll();
        res.send(response);
    }

    create = async (req, res, next) => {
        checkValidation(req);
        const response = await AssetsService.create(req.body, req.files);
        res.send(response);
    }

    update = async (req, res, next) => {
        checkValidation(req);
        const response = await AssetsService.update(req.body, req.files, req.validatedEntry);
        res.send(response);
    }

    delete = async (req, res, next) => {
        checkValidation(req);
        const response = await AssetsService.delete({id: req.params.id});
        res.send(response);
    }
}

module.exports = new AssetsController();