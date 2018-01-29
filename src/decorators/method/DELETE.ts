import {PathParams} from 'express-serve-static-core';
import {Method} from './Method';

/**
 * Use this handler for the DELETE HTTP method
 * @param path The path this handler will be responsible for
 */
export function DELETE(path: PathParams): MethodDecorator {
  return Method('delete', path);
}
