import {PathParams} from 'express-serve-static-core';
import {Method} from './Method';

/**
 * Use this handler for the GET HTTP method
 * @param path The path this handler will be responsible for
 */
export function GET(path: PathParams): MethodDecorator {
  return Method('get', path);
}
