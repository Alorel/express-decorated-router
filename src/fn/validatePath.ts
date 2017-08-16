import {endsWith, isString, startsWith} from 'lodash';

/**
 * Validate the path, throwing an error if it's invalid
 * @param {string} path The path to validate
 * @throws {Error} If the validation fails
 */
export const validatePath = (path: string): void => {
  if (!path) {
    throw new Error('Path is required');
  } else if (!isString(path)) {
    throw new Error('Path must be a string');
  } else if (!startsWith(path, '/') && path.charAt(0) !== '*') {
    throw new Error('Path must start with a slash');
  } else if (path.length > 1 && endsWith(path, '/')) {
    throw new Error('Path must not end with a slash');
  }
};