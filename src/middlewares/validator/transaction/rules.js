const Joi = require("joi");

const rulesBody = Joi.object({
  coupon: Joi.string().allow(null),
  delivery_cost: Joi.string().allow(null),
  tax: Joi.string().allow(null),
  products: Joi.array().required(),
});

module.exports = { rulesBody };
