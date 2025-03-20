require('dotenv').config();
const { ExpressLoader } = require('./src/loaders/express.loader');
const { RoutesLoader } = require('./src/loaders/routes.loader');
const { MiddlewareLoader } = require('./src/loaders/middleware.loader');
const { Config } = require('./src/configs/config')
const DBConnect = require('./src/db/connect.db');

// const https = require('https');
// const fs = require('fs');

const app = ExpressLoader.init();

const version = "v1";
RoutesLoader.initRoutes(app, version);

MiddlewareLoader.init(app);
DBConnect.init();

// const options = {
//     key: fs.readFileSync("dev_ssl/be-key.pem", "utf8"),
//     cert: fs.readFileSync("dev_ssl/be-cert.pem", "utf8")
// }

// const port = Config.PORT;
// https.createServer(options, app).listen(port, () => {
//     console.log(`LOCAL SSL SERVER ACTIVE ON PORT ${port}!`)
// });

const port = Config.PORT;
app.listen(port, () => {
    const divider = '=================';
    console.log(`${divider} ARTCREATION-DV SERVER ${divider}\n${divider} RUNNING ON PORT: ${port} ${divider}`);
});

module.exports = app;