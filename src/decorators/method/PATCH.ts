import {PathParams} from 'express-serve-static-core';
import {Method} from './Method';

/**
 * Use this handler for the PATCH HTTP method
 * @param path The path this handler will be responsible for
 */
export function PATCH(path: PathParams): MethodDecorator {
  return Method('patch', path);
}
