const Joi = require("joi");

const rulesBody = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string().required(),
});

module.exports = { rulesBody };
