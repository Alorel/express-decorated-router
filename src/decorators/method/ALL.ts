import {PathParams} from 'express-serve-static-core';
import {Method} from './Method';

/**
 * Use this handler for any HTTP method
 * @param path The path this handler will be responsible for
 */
export function ALL(path: PathParams): MethodDecorator {
  return Method('all', path);
}
