const Joi = require("joi");

const createSavingsSchema = Joi.object({

    title: Joi.string()
        .trim()
        .required(),

    targetAmount: Joi.number()
        .positive()
        .required(),

    targetDate: Joi.date()
        .optional(),

    description: Joi.string()
        .allow("")
        .optional()

});

const updateSavingsSchema = Joi.object({

    title: Joi.string()
        .trim(),

    targetAmount: Joi.number()
        .positive(),

    targetDate: Joi.date(),

    description: Joi.string()
        .allow("")

}).min(1);

const contributeSchema = Joi.object({

    amount: Joi.number()
        .positive()
        .required()

});

module.exports = {

    createSavingsSchema,

    updateSavingsSchema,

    contributeSchema

};