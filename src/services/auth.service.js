const User = require("../models/User");

const AppError = require("../utils/AppError");
const { hashPassword, comparePassword } = require("../utils/bcrypt");
const { generateToken } = require("../utils/jwt");
const userResponse = require("../utils/userResponse");

/**
 * Register User
 */
const signup = async (payload) => {

    const {
        firstName,
        lastName,
        email,
        password
    } = payload;

    const existingUser = await User.findOne({
        email: email.toLowerCase()
    });

    if (existingUser) {
        throw new AppError(
            "Email already exists",
            409
        );
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword
    });

    const token = generateToken({
        id: user._id
    });

    return {
        token,
        user: userResponse(user)
    };

};

/**
 * Login User
 */
const login = async (payload) => {

    const {
        email,
        password
    } = payload;

    const user = await User.findOne({
        email: email.toLowerCase()
    }).select("+password");

    if (!user) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }

    const isMatch = await comparePassword(
        password,
        user.password
    );

    if (!isMatch) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }

    const token = generateToken({
        id: user._id
    });

    user.password = undefined;

    return {
        token,
        user: userResponse(user)
    };

};

/**
 * Get Logged-in User
 */
const getProfile = async (userId) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(
            "User not found",
            404
        );
    }

    return userResponse(user);

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

    if (payload.firstName !== undefined) {
        user.firstName = payload.firstName;
    }

    if (payload.lastName !== undefined) {
        user.lastName = payload.lastName;
    }

    if (
        payload.email &&
        payload.email.toLowerCase() !== user.email
    ) {

        const existingUser = await User.findOne({
            email: payload.email.toLowerCase(),
            _id: { $ne: userId }
        });

        if (existingUser) {
            throw new AppError(
                "Email already exists",
                409
            );
        }

        user.email = payload.email.toLowerCase();

    }

    await user.save();

    return userResponse(user);

};

/**
 * Change Password
 */
const changePassword = async (
    userId,
    payload
) => {

    const {
        currentPassword,
        newPassword
    } = payload;

    const user = await User.findById(userId)
        .select("+password");

    if (!user) {
        throw new AppError(
            "User not found",
            404
        );
    }

    const isMatch = await comparePassword(
        currentPassword,
        user.password
    );

    if (!isMatch) {
        throw new AppError(
            "Current password is incorrect",
            400
        );
    }

    user.password = await hashPassword(
        newPassword
    );

    await user.save();

    return {
        message: "Password changed successfully"
    };

};

module.exports = {
    signup,
    login,
    getProfile,
    updateProfile,
    changePassword
};