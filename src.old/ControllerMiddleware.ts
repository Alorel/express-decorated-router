import {set} from 'lodash';
import {RequestHandler} from "express";

/**
 * Apply middleware to all routes within this controller
 * @param middleware The middleware to apply
 */
export const ControllerMiddleware = (...middleware: RequestHandler[]) => {
  return (constructor: any): void => {
    if (middleware.length) {
      set(constructor, '__router.use', middleware);
    }
  }
};