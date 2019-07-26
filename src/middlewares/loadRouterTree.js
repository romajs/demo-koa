const fs = require('fs');
const parentModule = require('parent-module');
const path = require('path');
const Router = require('koa-router');
const slash = require('slash');

const dirTreeSync = (dir, filters) => fs.readdirSync(dir)
  .filter(data => (filters && filters.length > 0 && filters.indexOf(data) > -1) || true) // FIXME:
  .map(data => {
    const file = path.join(dir, data);
    return fs.statSync(file, filters).isDirectory()
      ? { file, tree: dirTreeSync(file) }
      : { file };
  });

const loadRouteTree = (dirTree, getRoutePath, parentRouter) => {
  dirTree.forEach(({ file, tree }) => {
    const routePath = getRoutePath(file);
    if (tree) {
      loadRouteTree(tree, getRoutePath, parentRouter);
    } else {
      const subRouter = require(file);
      parentRouter.use(routePath, subRouter.routes());
      console.log(`Loaded "${file}" to "${routePath}".`);
    }
  });
  return parentRouter;
};

const loadRouterTree = (apiPath = '', apiPrefix = '', fileName = 'router.js') => {
  const callerDirname = path.dirname(parentModule());
  const apiBasename = path.normalize(apiPath);
  const apiDirPath = path.join(callerDirname, apiBasename);
  console.info(`Loading router tree from "${apiDirPath}".`);

  const apiDirTree = dirTreeSync(apiDirPath, [fileName]);
  // console.debug('apiDirTree:', apiDirTree);

  const getRoutePath = file => apiPrefix + slash(path.dirname(file).replace(apiDirPath, ''));
  const apiRouterTree = loadRouteTree(apiDirTree, getRoutePath, new Router());
  // console.debug('apiRouterTree:', apiRouterTree);

  return apiRouterTree.routes();
};

module.exports = loadRouterTree;
