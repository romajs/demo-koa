const serverError = () => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const { status, statusCode: code, message } = err;
    const statusCode = code || status || 500;
    ctx.status = statusCode;
    ctx.body = {
      error: 'Internal Server Error',
      message,
      statusCode,
    };
    ctx.app.emit('error', err, ctx);
  }
};

module.exports = serverError;
