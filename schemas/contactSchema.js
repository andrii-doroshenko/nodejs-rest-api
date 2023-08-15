const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "ua"] },
    })
    .required(),
  phone: Joi.string()
    .length(10)
    .regex(/^([+])?(\d+)$/)
    .message("Invalid phone number format")
    .required(),
});

module.exports = { contactSchema };
