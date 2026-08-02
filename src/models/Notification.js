const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: [
                "budget",
                "savings",
                "transaction",
                "reminder",
                "system"
            ],
            default: "system"
        },

        priority: {
            type: String,
            enum: [
                "low",
                "medium",
                "high"
            ],
            default: "medium"
        },

        isRead: {
            type: Boolean,
            default: false
        },

        // NEW: Links the notification to a resource
        relatedModel: {
            type: String,
            enum: [
                "Budget",
                "SavingsGoal",
                "Transaction",
                "Wallet"
            ],
            default: null
        },

        relatedId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },

        // NEW: Optional expiration date
        expiresAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Notification",
    notificationSchema
);