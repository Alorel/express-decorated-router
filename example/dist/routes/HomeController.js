"use strict";
const tslib_1 = require("tslib");
const dist_1 = require("express-decorated-router/dist");
const MiddlewareInstances_1 = require("../MiddlewareInstances");
const path_1 = require("path");
const fs_1 = require("fs");
let HomeController = class HomeController {
    static index(req, res) {
        fs_1.createReadStream(path_1.resolve(__dirname, '../../index.html'))
            .pipe(res);
    }
};
tslib_1.__decorate([
    dist_1.GET('/')
], HomeController, "index", null);
HomeController = tslib_1.__decorate([
    dist_1.Controller('/'),
    dist_1.ControllerMiddleware(MiddlewareInstances_1.morgan)
], HomeController);
module.exports = HomeController;
