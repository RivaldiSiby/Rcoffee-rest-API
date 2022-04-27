const Joi = require("joi");

const rules = Joi.object({
  discount: Joi.string().required(),
  description: Joi.string().required(),
  coupon: Joi.string().required(),
  product_id: Joi.string(),
});

module.exports = { rules };
