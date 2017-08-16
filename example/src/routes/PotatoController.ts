import {Controller, ControllerMiddleware, DELETE, GET, POST, PUT, RouteMiddleware} from "express-decorated-router/dist";
import {bodyParser, disableCache, morgan, potatoValidator} from "../MiddlewareInstances";
import {Request, Response} from "express";
import {MockDB} from "../MockDB";
import {IPotato} from "../IPotato";

@Controller('/potato')
@ControllerMiddleware(morgan, disableCache)
class PotatoController {

  @GET('/')
  static find(req: Request, res: Response) {
    const out = [];

    for (const potato of MockDB.values()) {
      out.push(potato);
    }

    res.json(out);
  }

  @GET('/:potatoID')
  static findOne(req: Request, res: Response) {
    const pid = parseInt(req.params.potatoID);
    if (MockDB.has(pid)) {
      res.json(MockDB.get(pid));
    } else {
      res.status(404).end();
    }
  }

  @POST('/')
  @RouteMiddleware(bodyParser, potatoValidator) // The order matters - potatoValidator depends on bodyParser
  static create(req: Request, res: Response) {
    if (MockDB.has(req.body.id)) {
      res.status(409).end();
    } else {
      const newPotato: IPotato = {id: req.body.id, size: req.body.size};
      MockDB.set(req.body.id, newPotato);
      res.status(201).json(newPotato);
    }
  }

  @PUT('/')
  @RouteMiddleware(bodyParser, potatoValidator)
  static putPotato(req: Request, res: Response) {
    const newPotato: IPotato = {id: req.body.id, size: req.body.size};
    MockDB.set(req.body.id, newPotato);
    res.status(201).json(newPotato);
  }

  @DELETE('/:potatoID')
  static destroy(req: Request, res: Response) {
    const potatoID = parseInt(req.params.potatoID);

    if (MockDB.has(potatoID)) {
      const potato = MockDB.get(potatoID);

      MockDB.delete(potatoID);
      res.status(200).json(potato);
    } else {
      res.status(404).end();
    }
  }
}

export = PotatoController;