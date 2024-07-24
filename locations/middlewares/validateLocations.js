const Joi = require("joi");

const validateLocation = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.int().required(),
    name: Joi.string().min(3).max(100).required(),
    street_address: Joi.string().min(3).max(500).required(),
    postal_code: Joi.int().max(6).required(),
    tel_num: Joi.int().max(8).required(),
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

module.exports = validateLocation;