const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
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

        balance: {
            type: Number,
            default: 0,
            min: 0
        },

        currency: {
            type: String,
            default: "NGN",
            uppercase: true
        },

        color: {
            type: String,
            default: "#2563EB"
        },

        icon: {
            type: String,
            default: "wallet"
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
 * A user cannot have two wallets
 * with the same name.
 */
walletSchema.index(
    {
        user: 1,
        name: 1
    },
    {
        unique: true
    }
);

/**
 * Faster lookups
 */
walletSchema.index({
    user: 1,
    isActive: 1
});

module.exports = mongoose.model(
    "Wallet",
    walletSchema
);