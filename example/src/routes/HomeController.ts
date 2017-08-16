import {Controller, ControllerMiddleware, GET} from "express-decorated-router/dist";
import {morgan} from "../MiddlewareInstances";
import {Request, Response} from "express";
import {resolve} from 'path';
import {createReadStream} from "fs";

@Controller('/')
@ControllerMiddleware(morgan)
class HomeController {

  @GET('/')
  public static index(req: Request, res: Response) {
    createReadStream(resolve(__dirname, '../../index.html'))
      .pipe(res);
  }
}

export = HomeController;