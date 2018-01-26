import {RequestHandler, RouterOptions} from 'express';

export interface HttpMethodSpec {
  [path: string]: RequestHandler;
}

export interface RouteSpec {
  [httpMethod: string]: HttpMethodSpec;
}

export interface ControllerSpec {
  conf?: RouterOptions;
  path: string;
}

export type ControllerMap = WeakMap<any, ControllerSpec>;
export type ControllerMiddlewareMap = WeakMap<any, RequestHandler[]>;
export type RouteMap = WeakMap<any, RouteSpec>;
export type RouteMiddlewareMap = WeakMap<any, ControllerRoutes>;
export type ControllerRoutes = WeakMap<RequestHandler, RequestHandler[]>;
