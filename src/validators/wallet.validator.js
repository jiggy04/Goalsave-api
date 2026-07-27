const Joi = require("joi");

const createWalletSchema = Joi.object({

    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "Wallet name is required",
            "string.min": "Wallet name must be at least 2 characters",
            "string.max": "Wallet name cannot exceed 50 characters"
        }),

    balance: Joi.number()
        .min(0)
        .default(0)
        .messages({
            "number.base": "Balance must be a number",
            "number.min": "Balance cannot be negative"
        }),

    currency: Joi.string()
        .trim()
        .uppercase()
        .length(3)
        .default("NGN")
        .messages({
            "string.length": "Currency must be a 3-letter code"
        }),

    color: Joi.string()
        .trim()
        .default("#2563EB"),

    icon: Joi.string()
        .trim()
        .default("wallet")

});

const updateWalletSchema = Joi.object({

    name: Joi.string()
        .trim()
        .min(2)
        .max(50),

    balance: Joi.number()
        .min(0),

    currency: Joi.string()
        .trim()
        .uppercase()
        .length(3),

    color: Joi.string()
        .trim(),

    icon: Joi.string()
        .trim(),

    isDefault: Joi.boolean(),

    isActive: Joi.boolean()

}).min(1);

module.exports = {
    createWalletSchema,
    updateWalletSchema
};