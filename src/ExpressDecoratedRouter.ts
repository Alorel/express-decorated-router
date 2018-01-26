import * as e from 'express';
import {
  ControllerMap,
  ControllerMiddlewareMap,
  ControllerRoutes,
  ControllerSpec,
  RouteMap,
  RouteMiddlewareMap,
  RouteSpec
} from './InternalTypes';
import {Util} from './Util';
import set = require('lodash/set');

export class ExpressDecoratedRouter {

  public readonly app: e.Application;
  private readonly controllerMap: ControllerMap = new WeakMap<any, ControllerSpec>();
  private readonly controllerMiddlewareMap: ControllerMiddlewareMap = new WeakMap<any, e.RequestHandler[]>();
  private readonly routeMap: RouteMap = new WeakMap<any, RouteSpec>();
  private readonly routeMiddlewareMap: RouteMiddlewareMap = new WeakMap<any, ControllerRoutes>();

  public constructor(app?: e.Application) {
    this.app = app || e();
  }

  public ALL(path: string): MethodDecorator {
    return this.Method('all', path);
  }

  public Before(...middleware: e.RequestHandler[]): MethodDecorator {
    return (target: any, key: string | symbol, descriptor: PropertyDescriptor): void => {
      if (middleware.length) {
        descriptor = Util.getAndValidateDescriptor(target, key, descriptor);

        Util.validateMiddleware(descriptor.value);
        for (const mid of middleware) {
          Util.validateMiddleware(mid);
        }

        let controllerRoutes: ControllerRoutes = <ControllerRoutes>this.routeMiddlewareMap.get(target);

        if (!controllerRoutes) {
          controllerRoutes = new WeakMap<e.RequestHandler, e.RequestHandler[]>();
          this.routeMiddlewareMap.set(target, controllerRoutes);
        }

        controllerRoutes.set(descriptor.value, middleware);
      }
    };
  }

  public BeforeEach(...middleware: e.RequestHandler[]): ClassDecorator {
    for (const mid of middleware) {
      Util.validateMiddleware(mid);
    }

    return (constructor: any): void => {
      if (middleware.length) {
        this.controllerMiddlewareMap.set(constructor, middleware);
      }
    };
  }

  public Controller(root = '/', config?: e.RouterOptions): ClassDecorator {
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
