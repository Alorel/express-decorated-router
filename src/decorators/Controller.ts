import {RouteRepository} from '../RouteRepository';
import {Util} from '../Util';
import * as _ from 'lodash';

export function Controller(root = '/'): ClassDecorator {
  Util.validatePath(root);

  let foo = 'bar';

  return function (constructor: any): void {
    RouteRepository.addController(constructor, root);
  };
}