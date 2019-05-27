const body = require('koa-body')
const compress = require('koa-compress')
const cors = require('koa-cors')
const helmet = require('koa-helmet')
const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()

app.use(body())
app.use(compress())
app.use(cors())
app.use(helmet())

router.get('/health', (ctx) => {
  ctx.body = { status: 'UP' }
})

app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app
