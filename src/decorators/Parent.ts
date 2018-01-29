import {ExpressDecoratedRouter} from '../ExpressDecoratedRouter';

/**
 * Define another controller as this controller's parent, inheriting its root path and middleware.
 * @param parentController The parent controller
 */
export function Parent(parentController: Function): ClassDecorator {
  return (child: Function): void => {
    ExpressDecoratedRouter.addParent(child, parentController);
  };
}
