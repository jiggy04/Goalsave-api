const authService = require("../services/auth.service");

const ApiResponse = require("../utils/ApiResponse");

const asyncHandler = require("../utils/asyncHandler");

const userResponse = require("../utils/userResponse");


const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);

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
    register,
    login,
    getProfile
};