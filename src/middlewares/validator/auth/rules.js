const Joi = require("joi");

const rulesRegis = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phone: Joi.number().min(11).required(),
});
const rulesSignIn = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  device: Joi.string().required(),
  notification_token: Joi.string(),
});

module.exports = { rulesSignIn, rulesRegis };
