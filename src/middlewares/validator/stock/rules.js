const Joi = require("joi");

const rulesPost = Joi.object({
  product_id: Joi.string().required(),
  size: Joi.string().required(),
  quantity: Joi.string().required(),
  price_unit: Joi.string().required(),
});
const rulesPut = Joi.object({
  product_id: Joi.string(),
  size: Joi.string(),
  quantity: Joi.string(),
  price_unit: Joi.string(),
  add_quantity: Joi.string(),
});

module.exports = { rulesPost, rulesPut };
