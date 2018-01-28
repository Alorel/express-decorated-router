import * as e from 'express';
import * as fs from 'fs';
import * as path from 'path';
import {Conf} from './src/Conf';

//tslint:disable:no-var-requires
fs.readdirSync(path.join(__dirname, 'src', 'controllers'), 'utf8')
  .map((file: string): string => path.join(__dirname, 'src', 'controllers', file))
  .forEach((file: string): void => {
    require(file);
  });

const app: e.Application = e();

app.listen(Conf.PORT, () => {
  const tty: any = require('tty-table');
  const header = [
    {
      color: 'green',
      value: 'Path',
      width: 30
    },
    {
      value: 'Description',
      width: 80,
    }
  ];
  const rows: any[] = require('./src/paths.json');

  const table = tty(header, rows, {
    align: 'left'
  });
  console.log(table.render());

  console.log(`The example server is now listening on port ${Conf.PORT}. Try one of the routes above!`);
});
