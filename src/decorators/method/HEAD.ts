import {PathParams} from 'express-serve-static-core';
import {Method} from './Method';

/**
 * Use this handler for the OPTIONS HTTP method
 * @param path The path this handler will be responsible for
 */
export function OPTIONS(path: PathParams): MethodDecorator {
  return Method('options', path);
}
