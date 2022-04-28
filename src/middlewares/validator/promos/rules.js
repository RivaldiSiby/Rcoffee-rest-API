const Joi = require("joi");

const rulesPost = Joi.object({
  discount: Joi.string(),
  description: Joi.string().required(),
  coupon: Joi.string().required(),
  product_id: Joi.string(),
});
const rulesPut = Joi.object({
  discount: Joi.string(),
  description: Joi.string(),
  coupon: Joi.string(),
  product_id: Joi.string(),
});

module.exports = { rulesPost, rulesPut };
