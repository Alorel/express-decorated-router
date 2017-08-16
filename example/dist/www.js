"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http_1 = require("http");
const dist_1 = require("express-decorated-router/dist");
const path_1 = require("path");
const app = express();
new dist_1.ControllerLoader(app).loadDirectories(false, path_1.resolve(__dirname, './routes/**/*.js'));
const port = 8044;
app.set('port', port);
const server = http_1.createServer(app);
server.listen(port);
server.on('error', console.error);
server.once('listening', () => {
    console.log(`Server listening @ port http://localhost:${port}`);
});
