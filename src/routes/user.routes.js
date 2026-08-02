const express = require("express");

const authenticate =
    require("../middleware/auth.middleware");

const validate =
    require("../middleware/validate.middleware");

const userController =
    require("../controllers/user.controller");

const {
    updateProfileSchema
} = require("../validators/user.validator");

const router = express.Router();

router.use(authenticate);

router.get(
    "/profile",
    userController.getProfile
);

router.patch(
    "/profile",
    validate(updateProfileSchema),
    userController.updateProfile
);

module.exports = router;