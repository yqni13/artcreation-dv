const mailingRouter = require('../routes/mailing.route');
const authRouter = require('../routes/auth.route');

class RoutesLoader {
    static initRoutes(app, version) {
        app.use(`/api/${version}/mailing`, mailingRouter);
        app.use(`/api/${version}/auth`, authRouter);
    }
}

module.exports = { RoutesLoader };