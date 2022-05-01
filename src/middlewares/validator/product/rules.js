const Joi = require("joi");

const rulesPost = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string().required(),
  img: Joi.string().required(),
});
const rulesPatch = Joi.object({
  name: Joi.string(),
  category: Joi.string(),
  description: Joi.string(),
  img: Joi.string(),
});

module.exports = { rulesPost, rulesPatch };
