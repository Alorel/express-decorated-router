"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const validatePath_1 = require("./fn/validatePath");
/**
 * Generic route annotation
 * @param {string} httpMethod The route's HTTP method in lowercase
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
exports.Method = (httpMethod, path) => {
    validatePath_1.validatePath(path);
    return (target, key, descriptor) => {
        if (!descriptor) {
            descriptor = Object.getOwnPropertyDescriptor(target, key);
        }
        lodash_1.set(target, ['__router', 'defs', httpMethod, path], descriptor.value);
    };
};
/**
 * Route for all HTTP methods
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
exports.ALL = (path = '/') => exports.Method('all', path);
/**
 * Route for the DELETE HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
exports.DELETE = (path = '/') => exports.Method('delete', path);
/**
 * Route for the GET HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
exports.GET = (path = '/') => exports.Method('get', path);
/**
 * Route for the HEAD HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
exports.HEAD = (path = '/') => exports.Method('head', path);
/**
 * Route for the OPTIONS HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
exports.OPTIONS = (path = '/') => exports.Method('options', path);
/**
 * Route for the PATCH HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
exports.PATCH = (path = '/') => exports.Method('patch', path);
/**
 * Route for the POST HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
exports.POST = (path = '/') => exports.Method('post', path);
/**
 * Route for the PUT HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
exports.PUT = (path = '/') => exports.Method('put', path);
