const MailingRepository = require('../repositories/mailing.repository');
const { checkValidation } = require('../middleware/validation.middleware');

class MailingController {
    sendMail = async (req, res, next) => {
        checkValidation(req);
        const response = await MailingRepository.sendMail(req.body);
        res.send(response);
    }
}

module.exports = new MailingController;