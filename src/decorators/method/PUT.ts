import {PathParams} from 'express-serve-static-core';
import {Method} from './Method';

/**
 * Use this handler for the PUT HTTP method
 * @param path The path this handler will be responsible for
 */
export function PUT(path: PathParams): MethodDecorator {
  return Method('put', path);
}
