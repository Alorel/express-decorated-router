import {RouteRepository} from '../RouteRepository';
import {Util} from '../Util';

export function Controller(root = '/'): ClassDecorator {
  Util.validatePath(root);

  return function(constructor: any): void {
    RouteRepository.addController(constructor, root);
  };
}
