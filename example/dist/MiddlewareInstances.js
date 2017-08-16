"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const morganPkg = require("morgan");
const bodyParserPkg = require("body-parser");
exports.morgan = morganPkg('dev');
exports.bodyParser = bodyParserPkg.json();
exports.potatoValidator = (req, res, next) => {
    if (req.body) {
        if (req.body.id && typeof req.body.id === 'number' && req.body.size && typeof req.body.size === 'string') {
            setImmediate(next);
            return;
        }
    }
    res.status(400).end();
};
exports.disableCache = (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', 0);
    setImmediate(next);
};
