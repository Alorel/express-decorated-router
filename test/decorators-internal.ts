import {expect} from 'chai';
import {PathParams} from 'express-serve-static-core';
import forEach = require('lodash/forEach');
import {Controller} from '../src/decorators/Controller';
import {ControllerMiddleware} from '../src/decorators/ControllerMiddleware';
import {ALL} from '../src/decorators/method/ALL';
import {DELETE} from '../src/decorators/method/DELETE';
import {GET} from '../src/decorators/method/GET';
import {OPTIONS} from '../src/decorators/method/HEAD';
import {HEAD} from '../src/decorators/method/OPTIONS';
import {PATCH} from '../src/decorators/method/PATCH';
import {POST} from '../src/decorators/method/POST';
import {PUT} from '../src/decorators/method/PUT';
import {Parent} from '../src/decorators/Parent';
import {RouteMiddleware} from '../src/decorators/RouteMiddleware';
import {ExpressDecoratedRouter} from '../src/ExpressDecoratedRouter';

describe('Decorators internal', () => {
  let originalMethod: any;
  let args: any[];

  beforeEach(() => {
    args = [];
  });

  describe('Route decorators', () => {
    before(() => {
      originalMethod = ExpressDecoratedRouter.addRoute;

      ExpressDecoratedRouter.addRoute = function () {
        args = Array.prototype.slice.call(arguments);
      };
    });

    after(() => {
      ExpressDecoratedRouter.addRoute = originalMethod;
    });

    const decorators = {
      ALL: ALL,
      DELETE: DELETE,
      GET: GET,
      HEAD: HEAD,
      OPTIONS: OPTIONS,
      PATCH: PATCH,
      POST: POST,
      PUT: PUT
    };

    forEach(decorators, (decorator: (path: PathParams) => MethodDecorator, name: string): void => {
      it(`${name.toUpperCase()} should add a(n) "${name.toLowerCase()}" route`, () => {
        class X {
          @decorator('/foo')
          public static y() {
          }
        }

        expect(args).to.deep.eq([
          X,
          name.toLowerCase(),
          '/foo',
          X.y
        ]);
      });
    });
  });

  describe('Controller', () => {
    before('override method', () => {
      originalMethod = ExpressDecoratedRouter.addController;

      ExpressDecoratedRouter.addController = function () {
        args = Array.prototype.slice.call(arguments);
      };
    });

    after('Reset method', () => {
      ExpressDecoratedRouter.addController = originalMethod;
    });

    it('Should call addController', () => {
      @Controller('/foo', {caseSensitive: true})
      class C {
      }

      expect(args).to.deep.eq([C, '/foo', {caseSensitive: true}]);
    });
  });

  describe('Parent', () => {

    before('override method', () => {
      originalMethod = ExpressDecoratedRouter.addParent;

      ExpressDecoratedRouter.addParent = function () {
        args = Array.prototype.slice.call(arguments);
      };
    });

    after('Reset method', () => {
      ExpressDecoratedRouter.addParent = originalMethod;
    });

    it('Should call addParent', () => {
      class P {
      }

      @Parent(P)
      class C {
      }

      expect(args).to.deep.eq([C, P]);
    });
  });

  describe('ControllerMiddleware', () => {
    before('override method', () => {
      originalMethod = ExpressDecoratedRouter.addControllerMiddleware;

      ExpressDecoratedRouter.addControllerMiddleware = function () {
        args = Array.prototype.slice.call(arguments);
      };
    });

    after('Reset method', () => {
      ExpressDecoratedRouter.addControllerMiddleware = originalMethod;
    });

    it('Should call addControllerMiddleware', () => {
      @ControllerMiddleware(<any>1, <any>0)
      class X {
      }

      expect(args).to.deep.eq([X, [1, 0]]);
    });
  });

  describe('RouteMiddleware', () => {
    before('override method', () => {
      originalMethod = ExpressDecoratedRouter.addRouteMiddleware;

      ExpressDecoratedRouter.addRouteMiddleware = function () {
        args = Array.prototype.slice.call(arguments);
      };
    });

    after('Reset method', () => {
      ExpressDecoratedRouter.addRouteMiddleware = originalMethod;
    });

    it('Should call addRouteMiddleware', () => {
      class X {
        @RouteMiddleware(<any>1, <any>2)
        public static y() {
        }
      }

      expect(args).to.deep.eq([X.y, [1, 2]]);
    });
  });
});
