const transactionService = require("../services/transaction.service");

const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Create Transaction
 */
const createTransaction = asyncHandler(
    async (req, res) => {

        const transaction =
            await transactionService.createTransaction(
                req.body,
                req.user._id
            );

        return ApiResponse.success(
            res,
            "Transaction created successfully",
            transaction,
            201
        );

    }
);

/**
 * Get Transactions
 */
const getTransactions = asyncHandler(
    async (req, res) => {

        const transactions =
            await transactionService.getTransactions(
                req.user._id,
                req.query
            );

        return ApiResponse.success(
            res,
            "Transactions retrieved successfully",
            transactions
        );

    }
);

/**
 * Get Transaction
 */
const getTransaction = asyncHandler(
    async (req, res) => {

        const transaction =
            await transactionService.getTransactionById(
                req.params.id,
                req.user._id
            );

        return ApiResponse.success(
            res,
            "Transaction retrieved successfully",
            transaction
        );

    }
);

/**
 * Update Transaction
 */
const updateTransaction = asyncHandler(
    async (req, res) => {

        const transaction =
            await transactionService.updateTransaction(
                req.params.id,
                req.body,
                req.user._id
            );

        return ApiResponse.success(
            res,
            "Transaction updated successfully",
            transaction
        );

    }
);

/**
 * Delete Transaction
 */
const deleteTransaction = asyncHandler(
    async (req, res) => {

        await transactionService.deleteTransaction(
            req.params.id,
            req.user._id
        );

        return ApiResponse.success(
            res,
            "Transaction deleted successfully", null
        );

    }
);

module.exports = {
    createTransaction,
    getTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction
};