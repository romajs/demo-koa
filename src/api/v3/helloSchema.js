const helloSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string' },
  },
};

module.exports = helloSchema;
