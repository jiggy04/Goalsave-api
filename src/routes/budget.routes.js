const express = require("express");

const budgetController = require("../controllers/budget.controller");

const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const {
    createBudgetSchema,
    updateBudgetSchema
} = require("../validators/budget.validator");

const router = express.Router();

router.use(authenticate);

router.post(
    "/",
    validate(createBudgetSchema),
    budgetController.createBudget
);

router.get(
    "/",
    budgetController.getBudgets
);

router.get(
    "/:id",
    budgetController.getBudgetById
);

router.patch(
    "/:id",
    validate(updateBudgetSchema),
    budgetController.updateBudget
);

router.delete(
    "/:id",
    budgetController.deleteBudget
);

module.exports = router;