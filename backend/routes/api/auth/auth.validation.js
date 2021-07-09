const { Joi } = require("express-validation");
const { roles } = require("../../../config");

module.exports = {
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .regex(/[a-zA-Z0-9]{3,30}/)
        .required(),
    }),
  },
  register: {
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        // .regex(/[a-zA-Z0-9]{3,30}/)
        .required(),
      role: Joi.string().valid(...roles),
    }),
  },
};
