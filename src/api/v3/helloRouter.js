const Router = require('koa-router');

const validation = require('../../middlewares/validation');
const helloSchema = require('./helloSchema');

const router = new Router({ prefix: '/hello' });

router.post('/', validation(helloSchema), ctx => {
  ctx.body = `Hello World, ${ctx.request.body.name}!`;
});

module.exports = router;
