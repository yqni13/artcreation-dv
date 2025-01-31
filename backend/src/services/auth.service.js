const { basicResponse } = require('../utils/common.utils');
const AuthModel = require('../models/auth.model');

class AuthService {
    login = async (params) => {
        const hasParams = Object.keys(params).length !== 0;
        const login = await AuthModel.login(hasParams ? params : {});
        return basicResponse(login, 1, "Success");
    }
}

module.exports = new AuthService;