const User = require("../models/User");

const { verifyToken } = require("../utils/jwt");

const ApiResponse = require("../utils/ApiResponse");

const asyncHandler = require("../utils/asyncHandler");

const authenticate = asyncHandler(async (req, res, next) => {

    const authorization = req.headers.authorization;

    if (
        !authorization ||
        !authorization.startsWith("Bearer ")
    ) {

        return ApiResponse.error(
            res,
            "Access denied. No token provided.",
            null,
            401
        );

    }

    const token = authorization.split(" ")[1];

    let decoded;

    try {

        decoded = verifyToken(token);

    } catch (error) {

        return ApiResponse.error(
            res,
            "Invalid or expired token.",
            null,
            401
        );

    }

    const user = await User.findOne({
        _id: decoded.id,
        isActive: true
    });

    if (!user) {

        return ApiResponse.error(
            res,
            "User not found.",
            null,
            401
        );

    }

    req.user = user;

   
    next();

});

module.exports = authenticate;