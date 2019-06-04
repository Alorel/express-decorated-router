exports.branch = 'master';
exports.tagFormat = '${version}';
exports.prepare = [
  '@semantic-release/changelog',
  '@alorel-personal/semantic-release',
  '@semantic-release/npm',
  {
    path: '@semantic-release/exec',
    cmd: `node "${require.resolve('./build/sync-dep-versions.js')}"`
  },
  {
    path: '@semantic-release/exec',
    // cmd: 'npm run doc'
    cmd: 'npm run doc:toc'
  },
  {
    path: '@semantic-release/git',
    message: 'chore(release): ${nextRelease.version}',
    assets: [
      'CHANGELOG.md',
      'README.md',
      'example/README.md',
      'package.json',
      'package-lock.json',
      'example/package.json'
    ]
  }
];

exports.generateNotes = {
  config: '@alorel-personal/conventional-changelog-alorel'
};

