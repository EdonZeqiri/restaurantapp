const { Joi } = require("express-validation");

module.exports = {
  create: {
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
    }).options({ allowUnknown: true }),
  },
  update: {
    body: Joi.object({
      name: Joi.string(),
      description: Joi.string(),
    }).options({ allowUnknown: true }),
  },
};
