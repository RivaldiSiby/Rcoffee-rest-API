const Joi = require("joi");

const rulesPost = Joi.object({
  product_id: Joi.string().required(),
  size: Joi.string().required(),
  quantity: Joi.string().required(),
  price_unit: Joi.string().required(),
});
const rulesPut = Joi.object({
  size: Joi.string().required(),
  quantity: Joi.string().required(),
  price_unit: Joi.string().required(),
});

module.exports = { rulesPost, rulesPut };
