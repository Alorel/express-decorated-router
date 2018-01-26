import {Application, RequestHandler, RouterOptions} from 'express';
import set = require('lodash/set');
import {Util} from './Util';

interface HttpMethodSpec {
  [path: string]: RequestHandler;
}

interface RouteSpec {
  [httpMethod: string]: HttpMethodSpec;
}

interface ControllerSpec {
  conf?: RouterOptions;
  path: string;
}

type ControllerRoutes = WeakMap<RequestHandler, RequestHandler[]>;

export class ExpressDecoratedRouter {

  public readonly app: Application;
  private readonly controllerMap = new WeakMap<any, ControllerSpec>();
  private readonly controllerMiddlewareMap = new WeakMap<any, RequestHandler[]>();
  private readonly routeMap = new WeakMap<any, RouteSpec>();
  private readonly routeMiddlewareMap = new WeakMap<any, ControllerRoutes>();

  public constructor(app: Application) {
    this.app = app;
  }

  public ALL(path: string): MethodDecorator {
    return this.Method('all', path);
  }

  public Before(...middleware: RequestHandler[]): MethodDecorator {
    return (target: any, key: string | symbol, descriptor: PropertyDescriptor): void => {
      if (middleware.length) {
        descriptor = Util.getAndValidateDescriptor(target, key, descriptor);

        Util.validateMiddleware(descriptor.value);
        for (const mid of middleware) {
          Util.validateMiddleware(mid);
        }

        let controllerRoutes: ControllerRoutes = <ControllerRoutes>this.routeMiddlewareMap.get(target);

        if (!controllerRoutes) {
          controllerRoutes = new WeakMap<RequestHandler, RequestHandler[]>();
          this.routeMiddlewareMap.set(target, controllerRoutes);
        }

        controllerRoutes.set(descriptor.value, middleware);
      }
    };
  }

  public BeforeEach(...middleware: RequestHandler[]): ClassDecorator {
    for (const mid of middleware) {
      Util.validateMiddleware(mid);
    }

    return (constructor: any): void => {
      if (middleware.length) {
        this.controllerMiddlewareMap.set(constructor, middleware);
      }
    };
  }

  public Controller(root = '/', config?: RouterOptions): ClassDecorator {
    Util.validatePath(root);

    return (constructor: any): void => {
      const output: ControllerSpec = {
        conf: config,
        path: root
      };

      this.controllerMap.set(constructor, output);
    };
  }

  public DELETE(path: string): MethodDecorator {
    return this.Method('delete', path);
  }

  public GET(path: string): MethodDecorator {
    return this.Method('get', path);
  }

  public HEAD(path: string): MethodDecorator {
    return this.Method('head', path);
  }

  public Method(httpMethod: string, path: string): MethodDecorator {
    Util.validatePath(path);

    return (target: any, key: string | symbol, descriptor: PropertyDescriptor): void => {
      descriptor = Util.getAndValidateDescriptor(target, key, descriptor);

      let routeSpec: RouteSpec = <RouteSpec>this.routeMap.get(target);

      if (!routeSpec) {
        routeSpec = {};
        this.routeMap.set(target, routeSpec);
      }

      set(routeSpec, [httpMethod, path], descriptor.value);
    };
  }

  public OPTIONS(path: string): MethodDecorator {
    return this.Method('options', path);
  }

  public PATCH(path: string): MethodDecorator {
    return this.Method('patch', path);
  }

  public POST(path: string): MethodDecorator {
    return this.Method('post', path);
  }

  public PUT(path: string): MethodDecorator {
    return this.Method('put', path);
  }
}
