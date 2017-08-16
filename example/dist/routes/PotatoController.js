"use strict";
const tslib_1 = require("tslib");
const dist_1 = require("express-decorated-router/dist");
const MiddlewareInstances_1 = require("../MiddlewareInstances");
const MockDB_1 = require("../MockDB");
let PotatoController = class PotatoController {
    static find(req, res) {
        const out = [];
        for (const potato of MockDB_1.MockDB.values()) {
            out.push(potato);
        }
        res.json(out);
    }
    static findOne(req, res) {
        const pid = parseInt(req.params.potatoID);
        if (MockDB_1.MockDB.has(pid)) {
            res.json(MockDB_1.MockDB.get(pid));
        }
        else {
            res.status(404).end();
        }
    }
    static create(req, res) {
        if (MockDB_1.MockDB.has(req.body.id)) {
            res.status(409).end();
        }
        else {
            const newPotato = { id: req.body.id, size: req.body.size };
            MockDB_1.MockDB.set(req.body.id, newPotato);
            res.status(201).json(newPotato);
        }
    }
    static putPotato(req, res) {
        const newPotato = { id: req.body.id, size: req.body.size };
        MockDB_1.MockDB.set(req.body.id, newPotato);
        res.status(201).json(newPotato);
    }
    static destroy(req, res) {
        const potatoID = parseInt(req.params.potatoID);
        if (MockDB_1.MockDB.has(potatoID)) {
            const potato = MockDB_1.MockDB.get(potatoID);
            MockDB_1.MockDB.delete(potatoID);
            res.status(200).json(potato);
        }
        else {
            res.status(404).end();
        }
    }
};
tslib_1.__decorate([
    dist_1.GET('/')
], PotatoController, "find", null);
tslib_1.__decorate([
    dist_1.GET('/:potatoID')
], PotatoController, "findOne", null);
tslib_1.__decorate([
    dist_1.POST('/'),
    dist_1.RouteMiddleware(MiddlewareInstances_1.bodyParser, MiddlewareInstances_1.potatoValidator) // The order matters - potatoValidator depends on bodyParser
], PotatoController, "create", null);
tslib_1.__decorate([
    dist_1.PUT('/'),
    dist_1.RouteMiddleware(MiddlewareInstances_1.bodyParser, MiddlewareInstances_1.potatoValidator)
], PotatoController, "putPotato", null);
tslib_1.__decorate([
    dist_1.DELETE('/:potatoID')
], PotatoController, "destroy", null);
PotatoController = tslib_1.__decorate([
    dist_1.Controller('/potato'),
    dist_1.ControllerMiddleware(MiddlewareInstances_1.morgan, MiddlewareInstances_1.disableCache)
], PotatoController);
module.exports = PotatoController;
