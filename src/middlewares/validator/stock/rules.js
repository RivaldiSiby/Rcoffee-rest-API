const Joi = require("joi");

const rulesPost = Joi.object({
  product_id: Joi.string().required(),
  size: Joi.string().required(),
  quantity: Joi.string().required(),
  price: Joi.string().required(),
});
const rulesPatch = Joi.object({
  product_id: Joi.string(),
  size: Joi.string(),
  quantity: Joi.string(),
  price: Joi.string(),
  add_quantity: Joi.string(),
});

module.exports = { rulesPost, rulesPatch };
