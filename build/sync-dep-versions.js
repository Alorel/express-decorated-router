const fs = require('fs');
const rootPkg = require('../package.json');

const targetPkgPath = require.resolve('../example/package.json');
const targetPkg = require(targetPkgPath);

const keys = ['peerDependencies', 'devDependencies', 'dependencies'];

for (const tgtKey of keys) {
  const tgtSection = targetPkg[tgtKey];
  if (tgtSection) {
    const tgtKeys = Object.keys(tgtSection);

    libLoop:
      for (const lib of tgtKeys) {
        for (const rootKey of keys) {
          const rootSection = rootPkg[rootKey];
          if (rootKey) {
            const rootKeys = Object.keys(rootSection);
            for (const rootLib of rootKeys) {
              if (rootLib === lib) {
                tgtSection[lib] = rootSection[rootLib];
                continue libLoop;
              }
            }
          }
        }
      }
  }
}

fs.writeFileSync(targetPkgPath, JSON.stringify(targetPkg, null, 2));
