const app = require('./app')
const config = require('./config')

let httpServer = null

const start = () => new Promise((resolve, reject) => {
  try {
    const [port, host] = [config.get('http.port'), config.get('http.host')]
    httpServer = app.listen(port, host, () => {
      console.log('Http server started on:', httpServer.address())
      resolve(httpServer)
    })
  } catch (err) {
    reject(err)
  }
})

const stop = () => httpServer.close()

module.exports = {
  start,
  stop
}
