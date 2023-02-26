const Joi = require("joi");

const userAddSchema = Joi.object({
  first_name: Joi.string().max(255).required().trim(),
  last_name: Joi.string().max(255).required().trim(),
  username: Joi.string().max(255).required().trim(),
  email: Joi.string().max(255).required().trim(),
  password: Joi.string().max(255).required().trim(),
  country: Joi.string().max(255).required().trim(),
  role: Joi.string().max(255).optional().trim(),
});

async function addUserValidationMW(req, res, next) {
  const userPayLoad = req.body;

  try {
    await userAddSchema.validateAsync(userPayLoad);
    next();
  } catch (error) {
    next({
      status: 400,
      message: error.details[0].message,
    });
  }
}

module.exports = {
  addUserValidationMW,
};

