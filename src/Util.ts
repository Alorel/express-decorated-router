import {RequestHandler} from 'express';

export class Util {
  public static validateMiddleware(middleware: RequestHandler): void {
    if (typeof middleware !== 'function') {
      throw new Error('Middleware must be a function');
    }
  }

  public static validatePath(path: string): void {
    if (!path) {
      throw new Error('Path is required');
    } else if (typeof path !== 'string') {
      throw new Error('Path must be a string');
    }
  }
}
