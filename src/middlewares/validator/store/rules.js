const Joi = require("joi");

const rules = Joi.object({
  name: Joi.string().required(),
  owner: Joi.string().required(),
  description: Joi.string().required(),
});

module.exports = { rules };
