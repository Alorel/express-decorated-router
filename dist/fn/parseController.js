"use strict";
const lodash_1 = require("lodash");
/**
 * Parse the controller into a loadable form
 * @param router A class with routes defined
 * @param {boolean} clean If set to true (default), cleans up the class created by the routing decorators and making it impossible to parse the class again.
 * @returns {IController} A controller definition that's usable by the loader
 */
exports.parseController = (router, clean = true) => {
    const out = {};
    out.root = lodash_1.get(router, '__router.root');
    if (!out.root) {
        throw new Error('The controller must be annotated with @Controller!');
    }
    out.defs = lodash_1.cloneDeep(lodash_1.get(router, '__router.defs', {}));
    const controllerMiddleware = lodash_1.get(router, '__router.use', []);
    const routeMiddleware = lodash_1.get(router, '__router.middleware');
    if (routeMiddleware) {
        for (const x of routeMiddleware.entries()) {
            const method = x[0];
            const mids = x[1];
            const resolved = resolveRouteMiddleware(method, out.defs);
            if (resolved) {
                out.defs[resolved.httpMethod][resolved.path] = mids.concat(method);
            }
        }
    }
    if (controllerMiddleware.length) {
        lodash_1.forEach(out.defs, (routes, httpMethod) => {
            lodash_1.forEach(routes, (handler, path) => {
                if (!lodash_1.isArray(handler)) {
                    handler = [handler];
                }
                lodash_1.set(out, ['defs', httpMethod, path], controllerMiddleware.slice().concat(...handler));
            });
        });
    }
    if (clean) {
        router['__router'] = undefined;
    }
    return out;
};
const resolveRouteMiddleware = (method, defs) => {
    for (const httpMethod of lodash_1.keys(defs)) {
        for (const path of lodash_1.keys(defs[httpMethod])) {
            if (defs[httpMethod][path] === method) {
                return { httpMethod, path };
            }
        }
    }
};
