const Joi = require("joi");

const rules = Joi.object({
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

module.exports = { rules };
