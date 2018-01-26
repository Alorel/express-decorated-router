import {expect} from 'chai';
import forEach = require('lodash/forEach');
import {ALL} from '../src/decorators/method/ALL';
import {DELETE} from '../src/decorators/method/DELETE';
import {GET} from '../src/decorators/method/GET';
import {OPTIONS} from '../src/decorators/method/HEAD';
import {HEAD} from '../src/decorators/method/OPTIONS';
import {PATCH} from '../src/decorators/method/PATCH';
import {POST} from '../src/decorators/method/POST';
import {PUT} from '../src/decorators/method/PUT';
import {ExpressDecoratedRouter} from '../src/ExpressDecoratedRouter';

describe('Decorators base', () => {
  let originalAddRoute = ExpressDecoratedRouter.addRoute;
  let addRouteArgs: any[];

  ExpressDecoratedRouter.addRoute = function() {
    addRouteArgs = Array.prototype.slice.call(arguments);
  };

  beforeEach(() => {
    addRouteArgs = [];
  });

  after(() => {
    ExpressDecoratedRouter.addRoute = originalAddRoute;
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

  forEach(decorators, (decorator: (path: string) => MethodDecorator, name: string): void => {
    it(`${name} should add a(n) "${name.toLowerCase()}" route`, () => {
      class X {
        @decorator('/foo')
        public static y() {
        }
      }

      expect(addRouteArgs).to.deep.eq([
        X,
        name.toLowerCase(),
        '/foo',
        X.y
      ]);
    });
  });
});
