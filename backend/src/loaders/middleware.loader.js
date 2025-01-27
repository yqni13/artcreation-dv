const errorMiddleware = require('../middleware/error.middleware');

class MiddlewareLoader {
    static init(app) {
        app.all('*', (req, res, next) => {
            res.send('SERVER: ARTCREATION-DV.\nSTATUS: ACTIVE.');
        });

        app.use(errorMiddleware);
    }
}

module.exports = { MiddlewareLoader };