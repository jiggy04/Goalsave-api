const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        type: {
            type: String,
            enum: ["Income", "Expense"],
            required: true
        },

        color: {
            type: String,
            default: "#2563EB"
        },

        icon: {
            type: String,
            default: "folder"
        },

        isDefault: {
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
 * Prevent duplicate category names
 * for the same user and type.
 */
categorySchema.index(
    {
        user: 1,
        name: 1,
        type: 1,
        isActive: 1
    },
    {
        unique: true
    }
);

/**
 * Improve query performance.
 */
categorySchema.index({
    user: 1,
    type: 1,
    isActive: 1
});

module.exports = mongoose.model(
    "Category",
    categorySchema
);