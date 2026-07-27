const Joi = require("joi");

const createCategorySchema = Joi.object({

    name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required(),

    type: Joi.string()
        .valid(
            "Income",
            "Expense"
        )
        .required(),

    color: Joi.string()
        .trim()
        .default("#2563EB"),

    icon: Joi.string()
        .trim()
        .default("folder")

});

const updateCategorySchema = Joi.object({

    name: Joi.string()
        .trim()
        .min(2)
        .max(50),

    type: Joi.string()
        .valid(
            "Income",
            "Expense"
        ),

    color: Joi.string().trim(),

    icon: Joi.string().trim(),

    isDefault: Joi.boolean(),

    isActive: Joi.boolean()

}).min(1);

module.exports = {
    createCategorySchema,
    updateCategorySchema
};