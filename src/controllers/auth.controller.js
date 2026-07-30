const authService = require("../services/auth.service");

const ApiResponse = require("../utils/ApiResponse");

const asyncHandler = require("../utils/asyncHandler");

const userResponse = require("../utils/userResponse");


const signup = asyncHandler(async (req, res) => {
    const result = await authService.signup(req.body);

    return ApiResponse.success(
        res,
        "Registration successful",
        result,
        201
    );
});

const login = asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);

    return ApiResponse.success(
        res,
        "Login successful",
        result
    );
});

const getProfile = asyncHandler(async (req, res) => {
    return ApiResponse.success(
        res,
        "User retrieved successfully",
        userResponse(req.user)
    );
});

module.exports = {
    signup,
    login,
    getProfile
};