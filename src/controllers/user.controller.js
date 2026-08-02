const userService = require("../services/user.service");

const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Get Profile
 */
const getProfile = asyncHandler(
    async (req, res) => {

        const user =
            await userService.getProfile(
                req.user._id
            );

        return ApiResponse.success(
            res,
            "Profile retrieved successfully",
            user
        );

    }
);

/**
 * Update Profile
 */
const updateProfile = asyncHandler(
    async (req, res) => {

        const user =
            await userService.updateProfile(
                req.user._id,
                req.body
            );

        return ApiResponse.success(
            res,
            "Profile updated successfully",
            user
        );

    }
);

module.exports = {
    getProfile,
    updateProfile
};