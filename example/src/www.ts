import * as express from 'express';
import {Application} from 'express';
import {createServer, Server} from "http";
import {ControllerLoader} from "express-decorated-router/dist";
import {resolve} from 'path';

const app: Application = express();

new ControllerLoader(app).loadDirectories(false, resolve(__dirname, './routes/**/*.js'));

const port = 8044;
app.set('port', port);
const server: Server = createServer(app);
server.listen(port);

server.on('error', console.error);
server.once('listening', () => {
  console.log(`Server listening @ port http://localhost:${port}`);
});