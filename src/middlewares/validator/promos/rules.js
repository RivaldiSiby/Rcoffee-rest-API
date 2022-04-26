const Joi = require("joi");

const rules = Joi.object({
  discount: Joi.string().required(),
  description: Joi.string().required(),
  coupon: Joi.string().required(),
});

module.exports = { rules };
