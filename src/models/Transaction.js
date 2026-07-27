const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        wallet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Wallet",
            required: true,
            index: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            index: true
        },

        savingsGoal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SavingsGoal",
            default: null
        },

        type: {
            type: String,
            enum: ["Income", "Expense"],
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0.01
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ""
        },

        transactionDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

/**
 * Compound indexes
 */
transactionSchema.index({
    user: 1,
    transactionDate: -1
});

transactionSchema.index({
    user: 1,
    type: 1
});



module.exports = mongoose.model(
    "Transaction",
    transactionSchema
);