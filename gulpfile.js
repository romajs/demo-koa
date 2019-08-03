const fs = require('fs');
const pkg = require('pkg');
const gpg = require('gpg');
const path = require('path');

const BUILD_DIR = path.join(__dirname, 'build');

const noop = () => null;

const build = async (done) => {
  console.info('Cleaning build directory existing files.');
  fs.readdirSync(BUILD_DIR).forEach(fileName => {
    fs.unlinkSync(path.join(BUILD_DIR, fileName));
  });

  console.info('Creating output build packages.');
  await pkg.exec(['.', `--out-path=${path.basename(BUILD_DIR)}`, '--scripts', 'src/api/*"']);

  console.info('Creating sign keys.');
  fs.readdirSync(BUILD_DIR).forEach(buildName => {
    const inputPath = path.join(BUILD_DIR, buildName);
    const outputPath = `${inputPath}.sig`;

    console.info(`Creating sign key for build ${buildName}.`);
    gpg.callStreaming(inputPath, outputPath, ['--detach-sign'], noop);
  });

  done();
};

module.exports = {
  build,
};
