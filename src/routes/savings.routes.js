const express = require("express");

const savingsController = require("../controllers/savings.controller");

const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const {
    createSavingsSchema,
    updateSavingsSchema,
    contributeSchema
} = require("../validators/savings.validator");

const router = express.Router();

router.use(authenticate);

router.post(
    "/",
    validate(createSavingsSchema),
    savingsController.createGoal
);

router.get(
    "/",
    savingsController.getGoals
);

router.get(
    "/:id",
    savingsController.getGoalById
);

router.patch(
    "/:id",
    validate(updateSavingsSchema),
    savingsController.updateGoal
);

router.patch(
    "/:id/contribute",
    validate(contributeSchema),
    savingsController.contributeToGoal
);

router.delete(
    "/:id",
    savingsController.deleteGoal
);

module.exports = router;