const Joi = require("joi");

const createNotificationSchema = Joi.object({

    title: Joi.string()
        .trim()
        .min(3)
        .max(100)
        .required(),

    message: Joi.string()
        .trim()
        .min(5)
        .max(500)
        .required(),

    type: Joi.string()
        .valid(
            "budget",
            "savings",
            "transaction",
            "reminder",
            "system"
        )
        .default("system"),

    priority: Joi.string()
        .valid(
            "low",
            "medium",
            "high"
        )
        .default("medium")

});

module.exports = {

    createNotificationSchema

};