const fs = require('fs');
const parentModule = require('parent-module');
const path = require('path');
const Router = require('koa-router');
const slash = require('slash');

const isValidFileName = (data, filters) => {
  const valid = filters.some(filter => filter.test(data));
  return valid;
}

const dirTreeSync = (dir, filters) => fs.readdirSync(dir)
  .map(data => {
    const file = path.join(dir, data);
    return fs.statSync(file).isDirectory()
      ? { file, tree: dirTreeSync(file) }
      : { file };
  });

const loadRouteTree = (dirTree, getRoutePath, filters, parentRouter) => {
  dirTree.forEach(({ file, tree }) => {
    const routePath = getRoutePath(file);
    if (tree) {
      loadRouteTree(tree, getRoutePath, filters, parentRouter);
    } else if (isValidFileName(file, filters)) {
      const subRouter = require(file);
      parentRouter.use(routePath, subRouter.routes());
      console.log(`Loaded "${routePath}" from "${file}".`);
    }
  });
  return parentRouter;
};

const loadRouterTree = (apiPath = '', apiPrefix = '', filters = [/.*\.js/i]) => {
  const callerDirname = path.dirname(parentModule());
  const apiBasename = path.normalize(apiPath);
  const apiDirPath = path.join(callerDirname, apiBasename);
  console.info(`Loading router tree from "${apiDirPath}".`);

  const apiDirTree = dirTreeSync(apiDirPath);
  // console.debug('apiDirTree:', apiDirTree);

  const getRoutePath = file => apiPrefix + slash(path.dirname(file).replace(apiDirPath, ''));
  const apiRouterTree = loadRouteTree(apiDirTree, getRoutePath, filters, new Router());
  // console.debug('apiRouterTree:', apiRouterTree);

  return apiRouterTree.routes();
};

module.exports = loadRouterTree;
