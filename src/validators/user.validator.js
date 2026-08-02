const Joi = require("joi");

const updateProfileSchema = Joi.object({

  firstName: Joi.string()
    .trim()
    .pattern(/^[A-Za-z]+(?:[-' ][A-Za-z]+)*$/)
    .min(2)
    .max(50)
    .messages({
        "string.pattern.base":
            "First name can only contain letters, spaces, hyphens and apostrophes."
    }),

lastName: Joi.string()
    .trim()
    .pattern(/^[A-Za-z]+(?:[-' ][A-Za-z]+)*$/)
    .min(2)
    .max(50)
    .messages({
        "string.pattern.base":
            "Last name can only contain letters, spaces, hyphens and apostrophes."
    }),

    email: Joi.string()
        .email(),

    image: Joi.object({
        publicId: Joi.string().allow("", null),
        url: Joi.string().uri().allow("", null)
    })

}).min(1);

module.exports = {
    updateProfileSchema
};