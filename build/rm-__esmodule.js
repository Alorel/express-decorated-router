const fs = require('bluebird').promisifyAll(require('fs'));
const {join} = require('path');
const endsWith = require('lodash/endsWith');

const readdir = async path => {
  const files = await fs.readdirAsync(path, 'utf8');

  for (const file of files) {
    const filepath = join(path, file);
    const stat = await fs.lstatAsync(filepath);

    if (stat.isDirectory()) {
      await readdir(filepath);
    } else if (endsWith(file, '.js')) {
      let contents = await fs.readFileAsync(filepath, 'utf8');
      contents = contents.replace('Object.defineProperty(exports, "__esModule", { value: true });\n', '');
      await fs.writeFileAsync(filepath, contents);
    }
  }
};

readdir(join(__dirname, '../dist'));