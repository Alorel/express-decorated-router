import {set} from 'lodash';
import {validatePath} from "./fn/validatePath";

/**
 * Generic route annotation
 * @param {string} httpMethod The route's HTTP method in lowercase
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
export const Method = (httpMethod: string, path: string) => {
  validatePath(path);
  return (target: any, key: string, descriptor: PropertyDescriptor): void => {
    if (!descriptor) {
      descriptor = Object.getOwnPropertyDescriptor(target, key);
    }

    set(target, ['__router', 'defs', httpMethod, path], descriptor.value);
  };
};

/**
 * Route for all HTTP methods
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
export const ALL = (path: string = '/') => Method('all', path);

/**
 * Route for the DELETE HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
export const DELETE = (path: string = '/') => Method('delete', path);

/**
 * Route for the GET HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
export const GET = (path: string = '/') => Method('get', path);

/**
 * Route for the HEAD HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
export const HEAD = (path: string = '/') => Method('head', path);

/**
 * Route for the OPTIONS HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
export const OPTIONS = (path: string = '/') => Method('options', path);

/**
 * Route for the PATCH HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
export const PATCH = (path: string = '/') => Method('patch', path);

/**
 * Route for the POST HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
export const POST = (path: string = '/') => Method('post', path);

/**
 * Route for the PUT HTTP method
 * @param {string} path The route path
 * @throws See {@link validatePath}
 */
export const PUT = (path: string = '/') => Method('put', path);