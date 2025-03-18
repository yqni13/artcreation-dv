const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require('multer');

class ExpressLoader {
    static init() {
        const app = express();
        const upload = multer();

        app.use(bodyParser.json());
        app.use(upload.any()) // necessary to read file input
        app.use(cors());
        app.options("*", cors());

        return app;
    }
}

module.exports = { ExpressLoader };