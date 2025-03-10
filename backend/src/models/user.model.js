require('dotenv').config();
const Secrets = require('../utils/secrets.util')

class UserModel {

    findOne = async (params) => {
        if(!Object.keys(params).length) {
            return { error: 'no params found' };
        }

        const user = {
            name: Secrets.ADMIN_USER,
            id: '01'
        }
        return params === user.name ? user : null;
    }
}

module.exports = new UserModel;