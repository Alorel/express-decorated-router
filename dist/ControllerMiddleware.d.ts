/// <reference types="express" />
import {RequestHandler} from "express";
/**
 * Apply middleware to all routes within this controller
 * @param middleware The middleware to apply
 */
export declare const ControllerMiddleware: (...middleware: RequestHandler[]) => (constructor: any) => void;
