const server = require('./httpServer');

Promise.all([server.start()]).then(() => {
  return 'Application started successfully.';
});
