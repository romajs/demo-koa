const pkg = require('pkg');

const build = async (done) => {
  await pkg.exec(['.', '--out-path=build', '--scripts', 'src/api/*"']);
  done();
};

exports.default = build;
