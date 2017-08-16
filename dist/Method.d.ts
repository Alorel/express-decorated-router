/**
 * Generic route annotation
 * @param {string} httpMethod The route's HTTP method in lowercase
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
export declare const Method: (httpMethod: string, path: string) => (target: any, key: string, descriptor: PropertyDescriptor) => void;
/**
 * Route for all HTTP methods
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
export declare const ALL: (path?: string) => (target: any, key: string, descriptor: PropertyDescriptor) => void;
/**
 * Route for the DELETE HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
export declare const DELETE: (path?: string) => (target: any, key: string, descriptor: PropertyDescriptor) => void;
/**
 * Route for the GET HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
export declare const GET: (path?: string) => (target: any, key: string, descriptor: PropertyDescriptor) => void;
/**
 * Route for the HEAD HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
export declare const HEAD: (path?: string) => (target: any, key: string, descriptor: PropertyDescriptor) => void;
/**
 * Route for the OPTIONS HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
export declare const OPTIONS: (path?: string) => (target: any, key: string, descriptor: PropertyDescriptor) => void;
/**
 * Route for the PATCH HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
export declare const PATCH: (path?: string) => (target: any, key: string, descriptor: PropertyDescriptor) => void;
/**
 * Route for the POST HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
export declare const POST: (path?: string) => (target: any, key: string, descriptor: PropertyDescriptor) => void;
/**
 * Route for the PUT HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
export declare const PUT: (path?: string) => (target: any, key: string, descriptor: PropertyDescriptor) => void;
