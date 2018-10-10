function pkgExists(pkg) {
  try {
    require(pkg);

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

const typesExists = pkgExists('@types/express-serve-static-core/package.json');
const stdExists = pkgExists('express-serve-static-core/package.json');

console.log(`@types exists: ${typesExists}`);
console.log(`std exists: ${typesExists}`);

if (typesExists && stdExists) {
  const fs = require('fs');
  const path = require('path');

  const dir = path.dirname(require.resolve('express-serve-static-core/package.json'));
  const file = path.join(dir, 'express-serve-static-core.d.ts');

  if (fs.existsSync(file)) {
    console.log(`${path.relative(__dirname, file)} exists: true`);
    fs.unlinkSync(file);
  } else {
    console.log(`${path.relative(__dirname, file)} exists: false`);
  }
}