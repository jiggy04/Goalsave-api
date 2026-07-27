const mongoose = require("mongoose");

const savingsGoalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },

        targetAmount: {
            type: Number,
            required: true,
            min: 1
        },

        currentAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        targetDate: {
            type: Date,
            default: null
        },

        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ""
        },

        isCompleted: {
            type: Boolean,
            default: false
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

/**
 * Prevent duplicate goal names
 * for the same user.
 */
savingsGoalSchema.index(
    {
        user: 1,
        title: 1,
        isActive: 1
    },
    {
        unique: true
    }
);

/**
 * Improve query performance.
 */
savingsGoalSchema.index({
    user: 1,
    isCompleted: 1,
    isActive: 1
});

module.exports = mongoose.model(
    "SavingsGoal",
    savingsGoalSchema
);