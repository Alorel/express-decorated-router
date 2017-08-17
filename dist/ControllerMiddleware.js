"use strict";
const lodash_1 = require("lodash");
/**
 * Apply middleware to all routes within this controller
 * @param middleware The middleware to apply
 */
exports.ControllerMiddleware = (...middleware) => {
    return (constructor) => {
        if (middleware.length) {
            lodash_1.set(constructor, '__router.use', middleware);
        }
    };
};
