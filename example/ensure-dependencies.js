const pkgJson = require('./package.json');

if (pkgJson.dependencies['express-decorated-router']) {
  delete pkgJson.dependencies['express-decorated-router'];
  const fs = require('fs');
  const pkgJsonPath = require.resolve('./package.json');
  
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
}