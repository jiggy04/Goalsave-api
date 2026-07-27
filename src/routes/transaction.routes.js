const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const transactionController = require("../controllers/transaction.controller");

const {
    createTransactionSchema,
    updateTransactionSchema
} = require("../validators/transaction.validator");

const router = express.Router();

router.use(authenticate);

router.post(
    "/",
    validate(createTransactionSchema),
    transactionController.createTransaction
);

router.get(
    "/",
    transactionController.getTransactions
);

router.get(
    "/:id",
    transactionController.getTransaction
);

router.patch(
    "/:id",
    validate(updateTransactionSchema),
    transactionController.updateTransaction
);

router.delete(
    "/:id",
    transactionController.deleteTransaction
);

module.exports = router;