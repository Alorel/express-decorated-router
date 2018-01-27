import * as e from 'express';
import * as supertest from 'supertest';
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
import {RouteMiddleware} from '../src/decorators/RouteMiddleware';
import {ExpressDecoratedRouter} from '../src/ExpressDecoratedRouter';

describe('ExpressDecoratedRouter', () => {
  let app: e.Application;
  let request: supertest.SuperTest<supertest.Test>;

  beforeEach('Init new express app', () => {
    app = e();
    request = supertest(app);
  });

  afterEach('Reset library', () => {
    ExpressDecoratedRouter.reset();
  });

  describe('String routes', () => {
    it('DELETE should return 200', done => {
      @Controller('/a')
      class A {
        @DELETE('/b')
        public static a(_req: e.Request, res: e.Response) {
          res.end('foo');
        }
      }

      ExpressDecoratedRouter.applyRoutes(app);

      request.delete('/a/b')
        .expect(200, 'foo', done);
    });

    it('GET should return 200', done => {
      @Controller('/a')
      class A {
        @GET('/b')
        public static a(_req: e.Request, res: e.Response) {
          res.end('foo');
        }
      }

      ExpressDecoratedRouter.applyRoutes(app);

      request.get('/a/b')
        .expect(200, 'foo', done);
    });

    it('HEAD should return 200', done => {
      @Controller('/a')
      class A {
        @HEAD('/b')
        public static a(_req: e.Request, res: e.Response) {
          res.end();
        }
      }

      ExpressDecoratedRouter.applyRoutes(app);

      request.head('/a/b')
        .expect(200, done);
    });

    it('OPTIONS should return 200', done => {
      @Controller('/a')
      class A {
        @OPTIONS('/b')
        public static a(_req: e.Request, res: e.Response) {
          res.end();
        }
      }

      ExpressDecoratedRouter.applyRoutes(app);

      request.options('/a/b')
        .expect(200, done);
    });

    it('PATCH should return 200', done => {
      @Controller('/a')
      class A {
        @PATCH('/b')
        public static a(_req: e.Request, res: e.Response) {
          res.end('foo');
        }
      }

      ExpressDecoratedRouter.applyRoutes(app);

      request.patch('/a/b')
        .expect(200, 'foo', done);
    });

    it('POST should return 200', done => {
      @Controller('/a')
      class A {
        @POST('/b')
        public static a(_req: e.Request, res: e.Response) {
          res.end('foo');
        }
      }

      ExpressDecoratedRouter.applyRoutes(app);

      request.post('/a/b')
        .expect(200, 'foo', done);
    });

    it('PUT should return 200', done => {
      @Controller('/a')
      class A {
        @PUT('/b')
        public static a(_req: e.Request, res: e.Response) {
          res.end('foo');
        }
      }

      ExpressDecoratedRouter.applyRoutes(app);

      request.put('/a/b')
        .expect(200, 'foo', done);
    });

    describe('ALL', () => {
      beforeEach('Init routes', () => {
        @Controller('/a')
        class A {
          @ALL('/b')
          public static a(_req: e.Request, res: e.Response) {
            res.end();
          }
        }

        ExpressDecoratedRouter.applyRoutes(app);
      });

      const httpMethods = [
        'delete',
        'get',
        'head',
        'options',
        'patch',
        'post',
        'put'
      ];

      for (const httpMethod of httpMethods) {
        it(`${httpMethod.toUpperCase()} should return 200`, done => {
          request[httpMethod]('/a/b')
            .expect(200, done);
        });
      }
    });
  });

  describe('Regex routes', () => {
    beforeEach('init', () => {
      @Controller('/a')
      class A {
        @GET(/[0-9]/)
        public static b(_req: e.Request, res: e.Response): void {
          res.end();
        }
      }

      ExpressDecoratedRouter.applyRoutes(app);
    });

    it('Should match 0', done => {
      request.get('/a/0')
        .expect(200, done);
    });

    it('Should match 5', done => {
      request.get('/a/5')
        .expect(200, done);
    });
  });

  describe('Regex route array', () => {
    beforeEach('init', () => {
      @Controller('/a')
      class A {
        @GET([/[0-9]/, /[a-z]/])
        public static b(_req: e.Request, res: e.Response): void {
          res.end();
        }
      }

      ExpressDecoratedRouter.applyRoutes(app);
    });

    it('Should match 0', done => {
      request.get('/a/0')
        .expect(200, done);
    });

    it('Should match 5', done => {
      request.get('/a/5')
        .expect(200, done);
    });

    it('Should match b', done => {
      request.get('/a/b')
        .expect(200, done);
    });

    it('Should match m', done => {
      request.get('/a/m')
        .expect(200, done);
    });
  });

  describe('Array string routes', () => {
    beforeEach('Init', () => {
      @Controller('/a')
      class A {
        @GET(['/b', '/c'])
        public static b(_req: e.Request, res: e.Response): void {
          res.end();
        }
      }

      ExpressDecoratedRouter.applyRoutes(app);
    });

    it('/a/b should return 200', done => {
      request.get('/a/b')
        .expect(200, done);
    });

    it('/a/c should return 200', done => {
      request.get('/a/c')
        .expect(200, done);
    });
  });

  it.only('Middleware', done => {
    const order: string[] = [];

    const cm: e.RequestHandler = (_req: e.Request, res: e.Response, next: e.NextFunction): void => {
      res.header('cm', '1');
      order.push('cm');
      next();
    };
    const rm: e.RequestHandler = (_req: e.Request, res: e.Response, next: e.NextFunction): void => {
      res.header('rm', '1');
      order.push('rm');
      next();
    };

    @Controller()
    @ControllerMiddleware(cm)
    class X {
      @GET('foo')
      @RouteMiddleware(rm)
      public static y(_req: e.Request, res: e.Response): void {
        res.end();
      }
    }

    ExpressDecoratedRouter.applyRoutes(app);

    request.get('/foo')
      .expect('rm', '1')
      .expect('cm', '1')
      .expect(200, result => {
        try {
          // expect(order).to.deep.eq(['cm', 'rm']);
          done(result);
        } catch (e) {
          done(e);
        }
      });
  });
});
