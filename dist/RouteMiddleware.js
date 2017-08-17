"use strict";
const lodash_1 = require("lodash");
/**
 * Apply middleware to this route
 * @param middleware The middleware to apply
 */
exports.RouteMiddleware = (...middleware) => {
    return (target, key, descriptor) => {
        if (middleware.length) {
            if (!descriptor) {
                descriptor = Object.getOwnPropertyDescriptor(target, key);
            }
            const routeMiddlewarePath = '__router.middleware';
            if (!lodash_1.get(target, routeMiddlewarePath)) {
                lodash_1.set(target, routeMiddlewarePath, new Map());
            }
            const midMap = lodash_1.get(target, routeMiddlewarePath);
            midMap.set(descriptor.value, middleware);
        }
    };
};
