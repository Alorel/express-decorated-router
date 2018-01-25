import {set} from 'lodash';
import {validatePath} from "./fn/validatePath";

/**
 * Annotates the class as a controller
 * @param {string} root The controller root URL
 * @throws See {@link validatePath}
 */
export const Controller = (root: string = '/') => {
  validatePath(root);

  return (constructor: any) => {
    set(constructor, '__router.root', root);
  };
};
