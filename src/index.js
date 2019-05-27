const makeRunnable = require('make-runnable/custom')

const server = require('./server')

const start = () => Promise.all([server.start()]).then(() => {
  return 'Application started successfully.'
})

const stop = () => Promise.all([server.stop()]).then(() => {
  return 'Application stoped successfully.'
})

module.exports = {
  start,
  stop
}

// makeRunnable must be called after module.exports
makeRunnable({ printOutputFrame: false })
