const Joi = require("joi");

const blogAddSchema = Joi.object({
  title: Joi.string().max(255).required().trim(),
  description: Joi.string().max(255).optional().trim(),
  body: Joi.string().max(255).required().trim(),
  tags: Joi.string().max(255).optional().trim(),
  state: Joi.string().max(255).optional().trim(),
});

const updateBlogSchema = Joi.object({
  title: Joi.string().optional().trim(),
  description: Joi.string().optional().trim(),
  body: Joi.string().max(255).optional().trim(),
  tags: Joi.string().max(255).optional().trim(),
});

async function addBlogValidationMW(req, res, next) {
  const blogPayLoad = req.body;

  try {
    await blogAddSchema.validateAsync(blogPayLoad);
    next();
  } catch (error) {
    next({
      status: 400,
      message: error.details[0].message,
    });
  }
}

async function updateBlogValidationMW(req, res, next) {
  const blogPayLoad = req.body;

  try {
    await updateBlogSchema.validateAsync(blogPayLoad);
    next();
  } catch (error) {
    next({
      status: 400,
      message: error.details[0].message,
    });
  }
}

module.exports = {
  addBlogValidationMW,
  updateBlogValidationMW,
};

