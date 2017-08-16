"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
/**
 * Validate the path, throwing an error if it's invalid
 * @param {string} path The path to validate
 * @throws {Error} If the validation fails
 */
exports.validatePath = (path) => {
    if (!path) {
        throw new Error('Path is required');
    }
    else if (!lodash_1.isString(path)) {
        throw new Error('Path must be a string');
    }
    else if (!lodash_1.startsWith(path, '/') && path.charAt(0) !== '*') {
        throw new Error('Path must start with a slash');
    }
    else if (path.length > 1 && lodash_1.endsWith(path, '/')) {
        throw new Error('Path must not end with a slash');
    }
};
