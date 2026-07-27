const Joi = require("joi");

const createBudgetSchema = Joi.object({

    title: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    category: Joi.string()
        .hex()
        .length(24)
        .required(),

    amount: Joi.number()
        .positive()
        .required(),

    startDate: Joi.date()
        .required(),

    endDate: Joi.date()
        .greater(Joi.ref("startDate"))
        .required()

});

const updateBudgetSchema = Joi.object({

    title: Joi.string()
        .trim()
        .min(2)
        .max(100),

    category: Joi.string()
        .hex()
        .length(24),

    amount: Joi.number()
        .positive(),

    startDate: Joi.date(),

    endDate: Joi.date(),

    status: Joi.string()
        .valid(
            "Active",
            "Completed",
            "Expired"
        ),

    isActive: Joi.boolean()

}).min(1);

module.exports = {
    createBudgetSchema,
    updateBudgetSchema
};