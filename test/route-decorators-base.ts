import {expect} from 'chai';
import {ALL} from '../src/decorators/method/ALL';
import {ExpressDecoratedRouter} from '../src/ExpressDecoratedRouter';

describe('Decorators base', () => {
  let originalAddRoute = ExpressDecoratedRouter.addRoute;
  let addRouteArgs: any[];

  ExpressDecoratedRouter.addRoute = function () {
    addRouteArgs = Array.prototype.slice.call(arguments);
  };

  beforeEach(() => {
    addRouteArgs = [];
  });

  after(() => {
    ExpressDecoratedRouter.addRoute = originalAddRoute;
  });

  it('ALL should add an "all" route', () => {
    class X {
      @ALL('/foo')
      public static y() {
      }
    }

    expect(addRouteArgs).to.deep.eq([
      X,
      'all',
      '/foo',
      X.y
    ]);
  });
});