import {PathParams} from 'express-serve-static-core';
import {Method} from './Method';

/**
 * Use this handler for the HEAD HTTP method
 * @param path The path this handler will be responsible for
 */
export function HEAD(path: PathParams): MethodDecorator {
  return Method('head', path);
}
