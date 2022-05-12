const Joi = require("joi");

const rulesRegis = Joi.object({
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
const rulesSignIn = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { rulesSignIn, rulesRegis };
