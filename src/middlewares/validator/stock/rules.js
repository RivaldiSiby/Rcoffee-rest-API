const Joi = require("joi");

const rules = Joi.object({
  size: Joi.string().required(),
  quantity: Joi.string().required(),
  price_unit: Joi.string().required(),
});

module.exports = { rules };
