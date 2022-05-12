const Joi = require("joi");

const rulesPost = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone: Joi.number().min(11).required(),
  date_birth: Joi.string().required(),
  gender: Joi.string().valid("man", "woman").required(),
  address: Joi.string().required(),
  role: Joi.string().required(),
  description: Joi.string().required(),
});
const rulesPatch = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  phone: Joi.number().min(11),
  date_birth: Joi.string(),
  gender: Joi.string().valid("man", "woman"),
  address: Joi.string(),
  role: Joi.string(),
  description: Joi.string(),
});

module.exports = { rulesPatch, rulesPost };
