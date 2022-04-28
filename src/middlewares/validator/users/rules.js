const Joi = require("joi");

const rulesPost = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phone: Joi.number().required(),
  date_birth: Joi.string().required(),
  gender: Joi.string().required(),
  address: Joi.string().required(),
  role: Joi.string().required(),
  description: Joi.string().required(),
});
const rulesPut = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  phone: Joi.number(),
  date_birth: Joi.string(),
  gender: Joi.string(),
  address: Joi.string(),
  role: Joi.string(),
  description: Joi.string(),
});

module.exports = { rulesPut, rulesPost };
