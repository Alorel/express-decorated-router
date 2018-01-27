import {ExpressDecoratedRouter} from '../ExpressDecoratedRouter';

export function Parent(parentController: Function): ClassDecorator {
  return (child: Function): void => {
    ExpressDecoratedRouter.addParent(child, parentController);
  };
}
