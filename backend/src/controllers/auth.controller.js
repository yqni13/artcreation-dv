const AuthService = require('../services/auth.service');
const { checkValidation } = require('../middleware/validation.middleware');

class AuthController {
    login = async (req, res, next) => {
        checkValidation(req);
        const response = await AuthService.login(req.body);
        res.send(response);
    }
}

module.exports = new AuthController();