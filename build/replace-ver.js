const path = require('path');
const fs = require('fs');

const readmePath = path.resolve(__dirname, '..', 'README.md');
const version = require('../package.json').version;

let readmeContents = fs.readFileSync(readmePath, 'utf8');
readmeContents = readmeContents.replace(/branch=master/ig, `branch=${version}`);

fs.writeFileSync(readmePath, readmeContents);
