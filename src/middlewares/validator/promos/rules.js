const Joi = require("joi");

const rulesPost = Joi.object({
  discount: Joi.string(),
  description: Joi.string().required(),
  coupon: Joi.string().required(),
  name: Joi.string().required(),
  size: Joi.string().required(),
  period_start: Joi.string().required(),
  expire: Joi.string().required(),
  product_id: Joi.string(),
});
const rulesPatch = Joi.object({
  discount: Joi.string(),
  description: Joi.string(),
  coupon: Joi.string(),
  product_id: Joi.string(),
  name: Joi.string(),
  size: Joi.string(),
  period_start: Joi.string(),
  expire: Joi.string(),
});

module.exports = { rulesPost, rulesPatch };
