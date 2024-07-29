const Joi = require("joi");

const validateEvent = (req, res, next) => {
  const schema = Joi.object({
    EventName: Joi.string().min(3).max(150).required(),
    EventDescription: Joi.string().min(5).max(1000).required(),
    TimeStart: Joi.date().iso().required(),
    TimeEnd: Joi.date().iso().required(),
    locationid: Joi.number().integer().positive().required()
  });

  const validation = schema.validate(req.body, { abortEarly: false }); // Validate request body

  if (validation.error) {
    const errors = validation.error.details.map((error) => error.message);
    res.status(400).json({ message: "Validation error", errors });
    return; // Terminate middleware execution on validation error
  }

  next(); // If validation passes, proceed to the next route handler
};

module.exports = validateEvent;