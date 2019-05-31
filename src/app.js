const body = require('koa-body')
const compress = require('koa-compress')
const cors = require('koa-cors')
const helmet = require('koa-helmet')
const Koa = require('koa')
const Router = require('koa-router')

const routes = require('./routes')

const app = new Koa()

app.use(body())
app.use(compress())
app.use(cors())
app.use(helmet())

const router = new Router()

Object.entries(routes()).forEach(([version, subRouter]) => {
  console.log(version, subRouter)
  router.use(`/api/${version}`, subRouter.routes())
})

app.use(router.routes())

module.exports = app
