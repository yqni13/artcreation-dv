const AuthService = require('../services/auth.service');
const { checkValidation } = require('../middleware/validation.middleware');

class AuthController {
    preConnect = async (req, res, next) => {
        const response = await AuthService.preConnect();
        res.send(response);
    }

    login = async (req, res, next) => {
        checkValidation(req);
        const response = await AuthService.login(req.body);
        res.send(response);
    }
}

module.exports = new AuthController();