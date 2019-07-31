const Ajv = require('ajv');
const jsonSchemaDraft06 = require('ajv/lib/refs/json-schema-draft-06.json');

const ajv = new Ajv();

ajv.addMetaSchema(jsonSchemaDraft06);

const mapErrorsToBodyResponse = errors => errors.map(error => ({
  at: error.dataPath,
  message: error.message,
  type: error.keyword,
}));

const validation = schema => {
  const validate = ajv.compile(schema);
  return (ctx, next) => {
    const { body } = ctx.request;
    const valid = validate(body);
    if (!valid) {
      ctx.status = 400;
      ctx.body = mapErrorsToBodyResponse(validate.errors);
      return;
    }
    return next();
  };
};

module.exports = validation;
