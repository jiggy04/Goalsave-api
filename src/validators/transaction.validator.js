const Joi = require("joi");

const createTransactionSchema = Joi.object({

    wallet: Joi.string()
        .hex()
        .length(24)
        .required(),

    category: Joi.string()
        .hex()
        .length(24)
        .required(),

    savingsGoal: Joi.string()
        .hex()
        .length(24)
        .allow(null, ""),

    type: Joi.string()
        .valid(
            "Income",
            "Expense"
        )
        .required(),

    amount: Joi.number()
        .positive()
        .required(),

    description: Joi.string()
        .trim()
        .allow("")
        .max(500),

    transactionDate: Joi.date()

});

const updateTransactionSchema = Joi.object({

    wallet: Joi.string()
        .hex()
        .length(24),

    category: Joi.string()
        .hex()
        .length(24),

    savingsGoal: Joi.string()
        .hex()
        .length(24)
        .allow(null, ""),

    type: Joi.string()
        .valid(
            "Income",
            "Expense"
        ),

    amount: Joi.number()
        .positive(),

    description: Joi.string()
        .trim()
        .allow("")
        .max(500),

    transactionDate: Joi.date()

}).min(1);

module.exports = {
    createTransactionSchema,
    updateTransactionSchema
};