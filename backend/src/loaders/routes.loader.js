const authRouter = require('../routes/auth.route');
const galleryRouter = require('../routes/gallery.route');
const mailingRouter = require('../routes/mailing.route');
const newsRouter = require('../routes/news.route');

class RoutesLoader {
    static initRoutes(app, version) {
        app.use(`/api/${version}/auth`, authRouter);
        app.use(`/api/${version}/gallery`, galleryRouter);
        app.use(`/api/${version}/mailing`, mailingRouter);
        app.use(`/api/${version}/news`, newsRouter);
    }
}

module.exports = { RoutesLoader };