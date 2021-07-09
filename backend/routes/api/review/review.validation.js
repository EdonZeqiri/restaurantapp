const { Joi } = require("express-validation");

module.exports = {
  create: {
    body: Joi.object({
      rating: Joi.number().min(1).max(5).required(),
      visited_at: Joi.date().max("now").required(),
      comment: Joi.string().required(),
    }).options({ allowUnknown: true }),
  },
  update: {
    body: Joi.object({
      rating: Joi.number().min(1).max(5),
      visited_at: Joi.date().max("now"),
      comment: Joi.string(),
    }).options({ allowUnknown: true }),
  },
};
