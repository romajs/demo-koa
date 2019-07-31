const FastestValidator = require('fastest-validator');

const validator = new FastestValidator();

const validation = schema => {
  const validate = validator.compile(schema);
  return (ctx, next) => {
    const { body } = ctx.request;
    const validationResult = validate(body);
    if (validationResult && Array.isArray(validationResult)) {
      ctx.status = 400;
      ctx.body = validationResult;
      return;
    }
    return next();
  };
};

module.exports = validation;
