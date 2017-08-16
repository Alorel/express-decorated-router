"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const validatePath_1 = require("./fn/validatePath");
/**
 * Annotates the class as a controller
 * @param {string} root The controller root URL
 * @throws See {@link validatePath}
 */
exports.Controller = (root = '/') => {
    validatePath_1.validatePath(root);
    return (constructor) => {
        lodash_1.set(constructor, '__router.root', root);
    };
};
