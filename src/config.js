console.debug(`Loading configuration, process.env.NODE_ENV=${process.env.NODE_ENV}`)

const convict = require('convict')
const dotenv = require('dotenv')

dotenv.config()

const config = convict({
  env: {
    format: ['production', 'development', 'test'],
    env: 'NODE_ENV'
  },
  http: {
    host: {
      format: 'ipaddress',
      default: '127.0.0.1',
      env: 'HOST',
      arg: 'host'
    },
    port: {
      format: 'port',
      default: 8000,
      env: 'PORT',
      arg: 'port'
    },
    rootBasePath: {
      format: String,
      default: '/',
      env: 'ROOT_BASE_PATH',
      arg: 'root-base-path'
    }
  },
  logger: {
    level: {
      format: String,
      default: 'debug',
      env: 'LOGGER_LEVEL',
      arg: 'logger-level'
    }
  }
})

config.validate({ allowed: 'strict' })

console.debug(`Configuration loaded sucesfully, config=${config.toString()}`)

module.exports = config
