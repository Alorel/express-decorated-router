import {SpawnSyncReturns} from 'child_process';
import * as spawn from 'cross-spawn';
import {dirname, join} from 'path';

//tslint:disable-next-line:no-var-requires
const parentDir: string = dirname(require.resolve('../package'));

let proc: SpawnSyncReturns<Buffer>;

if (process.env.CI) {
  console.log('Skipping parent npm install on CI');
} else {
  console.log('Running npm install on parent');
  proc = spawn.sync('npm', ['install'], {env: process.env, cwd: parentDir, stdio: 'inherit'});

  if (proc.error) {
    throw proc.error;
  }
}

console.log('building parent');
proc = spawn.sync('npm', ['run', 'build:release'], {env: process.env, cwd: parentDir, stdio: 'inherit'});

if (proc.error) {
  throw proc.error;
}

console.log('packing parent');
proc = spawn.sync('npm', ['pack'], {env: process.env, cwd: parentDir, stdio: 'inherit'});

if (proc.error) {
  throw proc.error;
}

console.log('Loading parent package.json');
//tslint:disable-next-line:no-var-requires
const parent: any = require('../package.json');

console.log('Installing parent');
proc = spawn.sync(
  'npm',
  ['install', '--no-save', join(parentDir, `${parent.name}-${parent.version}.tgz`)],
  {env: process.env, cwd: __dirname, stdio: 'inherit'}
);

if (proc.error) {
  throw proc.error;
}
