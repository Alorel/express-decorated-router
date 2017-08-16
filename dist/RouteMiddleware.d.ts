/// <reference types="express" />
import {RequestHandler} from "express";
/**
 * Apply middleware to this route
 * @param middleware The middleware to apply
 */
export declare const RouteMiddleware: (...middleware: RequestHandler[]) => (target: any, key: string, descriptor: PropertyDescriptor) => void;
