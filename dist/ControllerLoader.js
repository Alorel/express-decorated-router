"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lodash_1 = require("lodash");
const parseController_1 = require("./fn/parseController");
const glob_1 = require("glob");
/**
 * Class for loading controller definitions into your Express app
 */
class ControllerLoader {
    /**
     * Constructor
     * @param {Application} app Reference to your Express app
     */
    constructor(app) {
        this.app = app;
    }
    /**
     * Load a controller
     * @param controllerClass The controller class
     * @param {boolean} clean See {@link parseController}
     */
    loadController(controllerClass, clean = true) {
        const parsed = parseController_1.parseController(controllerClass, clean);
        const router = express_1.Router();
        lodash_1.forEach(parsed.defs, (routes, httpMethod) => {
            lodash_1.forEach(routes, (defs, path) => {
                if (!lodash_1.isArray(defs)) {
                    defs = [defs];
                }
                router[httpMethod](path, ...defs);
            });
        });
        this.app.use(parsed.root, router);
    }
    loadDirectories(cleanOrFirstGlob, ...globs) {
        let clean;
        let finalGlobs;
        if (lodash_1.isString(cleanOrFirstGlob)) {
            clean = true;
            finalGlobs = [cleanOrFirstGlob].concat(...globs);
        }
        else {
            clean = cleanOrFirstGlob;
            finalGlobs = globs;
        }
        for (const glob of finalGlobs) {
            const files = glob_1.sync(glob);
            for (const file of files) {
                this.loadController(require(file), clean);
            }
        }
    }
}
exports.ControllerLoader = ControllerLoader;
