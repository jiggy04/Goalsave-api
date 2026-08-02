const User = require("../models/User");

const AppError = require("../utils/AppError");

/**
 * Get Profile
 */
const getProfile = async (userId) => {

    const user = await User.findById(userId)
        .select("-password");

    if (!user) {
        throw new AppError(
            "User not found",
            404
        );
    }

    return user;

};

/**
 * Update Profile
 */
const updateProfile = async (
    userId,
    payload
) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(
            "User not found",
            404
        );
    }

    if (payload.firstName) {
        user.firstName = payload.firstName.trim();
    }

    if (payload.lastName) {
        user.lastName = payload.lastName.trim();
    }

    if (payload.email) {
        user.email = payload.email;
    }

    if (payload.image) {
        user.image = payload.image;
    }

    await user.save();

    return user.toObject({
        versionKey: false
    });

};

module.exports = {
    getProfile,
    updateProfile
};