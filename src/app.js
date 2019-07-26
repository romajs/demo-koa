const accesslog = require('koa-accesslog');
const body = require('koa-body')
const compress = require('koa-compress')
const cors = require('koa-cors')
const helmet = require('koa-helmet')
const Koa = require('koa')
const loadRouterTree = require('./middlewares/loadRouterTree')

const app = new Koa()
app.use(accesslog())
app.use(body())
app.use(compress())
app.use(cors())
app.use(helmet())
app.use(loadRouterTree('./api', '/api'))

module.exports = app
