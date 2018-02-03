import * as fs from 'fs';
import * as path from 'path';

const root: string = path.resolve(__dirname, '..');

let readmeContents: string = fs.readFileSync(path.join(root, 'README.base.md'), 'utf8');
const apiContents: string = fs.readFileSync(path.join(root, 'api', 'api.md'), 'utf8');

readmeContents = readmeContents.replace('<!-- INSERT API HERE -->', apiContents);

fs.writeFileSync(path.join(root, 'README.md'), readmeContents);
