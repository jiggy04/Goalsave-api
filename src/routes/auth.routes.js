const express = require("express");

const authController = require("../controllers/auth.controller");

const validate = require("../middleware/validate.middleware");
const authenticate = require("../middleware/auth.middleware");

const ApiResponse = require("../utils/ApiResponse");
const userResponse = require("../utils/userResponse");

const {
    signupSchema,
    loginSchema
} = require("../validators/auth.validator");

const router = express.Router();

router.post(
    "/signup",
    validate(signupSchema),
    authController.signup
);

router.post(
    "/login",
    validate(loginSchema),
    authController.login
);

router.get(
    "/me",
    authenticate,
    authController.getProfile,
    (req, res) => {
        return ApiResponse.success(
            res,
            "User retrieved successfully",
            req.user
        );
    }
);

module.exports = router;