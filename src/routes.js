const flatten = require('array-flatten')
const fs = require('fs')
const path = require('path')

const apiPath = path.join(__dirname, 'api')

const readdirSyncRecursively = dir => fs.readdirSync(dir).map(file => {
  const filePath = path.join(dir, file)
  return fs.statSync(filePath).isDirectory()
    ? readdirSyncRecursively(filePath)
    : filePath
})

const listFilesSyncRecursively = (dir, filters) => flatten(readdirSyncRecursively(dir))
  .filter(file => (filters && filters.length > 0 && filters.indexOf(file) > -1) || true)

let files = listFilesSyncRecursively(apiPath, ['router.js'])

const versions = ['v2', 'v1', ''] // FIXME:

const routes = () => files
  .map(name => [name, require(name)])
  .reduce((acc, [version, router]) => ({ ...acc, [versions.pop()]: router }), {})

module.exports = routes
