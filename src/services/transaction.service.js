const mongoose = require("mongoose");

const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");
const Category = require("../models/Category");
const SavingsGoal = require("../models/SavingsGoal");

const AppError = require("../utils/AppError");
const getQueryFeatures = require("../utils/queryFeatures");

/**
 * Update Wallet Balance
 */
const updateWalletBalance = async (
    walletId,
    type,
    amount,
    session
) => {

    const wallet = await Wallet.findById(walletId).session(session);

    if (!wallet) {
        throw new AppError(
            "Wallet not found",
            404
        );
    }

    if (type === "Income") {

        wallet.balance += amount;

    } else {

        if (wallet.balance < amount) {
            throw new AppError(
                "Insufficient wallet balance",
                400
            );
        }

        wallet.balance -= amount;

    }

    await wallet.save({ session });

};

/**
 * Update Savings Goal
 */
const updateSavingsGoal = async (
    goalId,
    amount,
    operation,
    session
) => {

    if (!goalId) return;

    const goal = await SavingsGoal.findById(goalId)
        .session(session);

    if (!goal) return;

    if (operation === "add") {

        goal.currentAmount += amount;

    } else {

        goal.currentAmount -= amount;

        if (goal.currentAmount < 0) {
            goal.currentAmount = 0;
        }

    }

    if (goal.currentAmount > goal.targetAmount) {
        goal.currentAmount = goal.targetAmount;
    }

    goal.isCompleted =
        goal.currentAmount >= goal.targetAmount;

    await goal.save({ session });

};

/**
 * Create Transaction
 */
const createTransaction = async (
    payload,
    userId
) => {
    if (!payload.amount || payload.amount <= 0) {
        throw new AppError(
                "Amount must be greater than zero",
                400
            );

        }

    const session = await mongoose.startSession();

    session.startTransaction();

    try {

        const wallet = await Wallet.findOne({
            _id: payload.wallet,
            user: userId,
            isActive: true
        }).session(session);

        if (!wallet) {
            throw new AppError(
                "Wallet not found",
                404
            );
        }

        const category = await Category.findOne({
            _id: payload.category,
            user: userId,
            isActive: true
        }).session(session);

        if (!category) {
            throw new AppError(
                "Category not found",
                404
            );
        }

        if (category.type !== payload.type) {
            throw new AppError(
                "Category type does not match transaction type",
                400
            );

        }

        await updateWalletBalance(
            wallet._id,
            payload.type,
            payload.amount,
            session
        );

        if (
            payload.type === "Expense" &&
            payload.savingsGoal
        ) {

            await updateSavingsGoal(
                payload.savingsGoal,
                payload.amount,
                "add",
                session
            );

        }

        const transaction = await Transaction.create(
            [
                {
                    user: userId,
                    wallet: payload.wallet,
                    category: payload.category,
                    savingsGoal:
                        payload.savingsGoal || null,
                    type: payload.type,
                    amount: payload.amount,
                    description:
                        payload.description,
                    transactionDate:
                        payload.transactionDate
                }
            ],
            { session }
        );

        await session.commitTransaction();

        return transaction[0];

    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        session.endSession();

    }

};

/**
 * Get Transactions
 */
const getTransactions = async (
    userId,
    query = {}
) => {

    const filter = {
        user: userId
    };

    if (query.wallet) {
        filter.wallet = query.wallet;
    }

    if (query.category) {
        filter.category = query.category;
    }

    if (query.type) {
        filter.type = query.type;
    }

    if (query.startDate || query.endDate) {

        filter.transactionDate = {};

        if (query.startDate) {
            filter.transactionDate.$gte = new Date(
                query.startDate
            );
        }

        if (query.endDate) {
            filter.transactionDate.$lte = new Date(
                query.endDate
            );
        }

    }

    const {
        limit,
        skip,
        sort
    } = getQueryFeatures(query);

    return await Transaction.find(filter)
        .populate("wallet", "name")
        .populate("category", "name type color icon")
        .populate("savingsGoal", "title")
        .sort(sort)
        .skip(skip)
        .limit(limit);

};

/**
 * Get Transaction By Id
 */
const getTransactionById = async (
    id,
    userId
) => {

    const transaction =
        await Transaction.findOne({
            _id: id,
            user: userId
        })
            .populate("wallet", "name")
            .populate("category", "name type color icon")
            .populate("savingsGoal", "title");

    if (!transaction) {

        throw new AppError(
            "Transaction not found",
            404
        );

    }

    return transaction;

};

/**
 * Update Transaction
 */
const updateTransaction = async (
    id,
    payload,
    userId
) => {

    const session =
        await mongoose.startSession();

    session.startTransaction();

    try {
        if (
            payload.amount !== undefined &&
            payload.amount <= 0
        ) {

            throw new AppError(
                "Amount must be greater than zero",
                400
            );

        }

        const transaction =
            await Transaction.findOne({
                _id: id,
                user: userId
            }).session(session);

        if (!transaction) {

            throw new AppError(
                "Transaction not found",
                404
            );

        }

        /**
         * Reverse old wallet balance
         */
        await updateWalletBalance(
            transaction.wallet,
            transaction.type === "Income"
                ? "Expense"
                : "Income",
            transaction.amount,
            session
        );

        /**
         * Reverse old savings contribution
         */
        if (
            transaction.type === "Expense" &&
            transaction.savingsGoal
        ) {

            await updateSavingsGoal(
                transaction.savingsGoal,
                transaction.amount,
                "remove",
                session
            );

        }

        /**
         * Validate new wallet
         */
        const wallet =
            await Wallet.findOne({
                _id:
                    payload.wallet ||
                    transaction.wallet,
                user: userId,
                isActive: true
            }).session(session);

        if (!wallet) {

            throw new AppError(
                "Wallet not found",
                404
            );

        }

        /**
         * Validate new category
         */
        const category = await Category.findOne({
            _id: payload.category || transaction.category,
            user: userId,
            isActive: true
        }).session(session);

        if (!category) {

            throw new AppError(
                "Category not found",
                404
            );

        }

        const newType = payload.type || transaction.type;

        if (category.type !== newType) {

            throw new AppError(
                "Category type does not match transaction type",
                400
            );

        }

        if (!category) {

            throw new AppError(
                "Category not found",
                404
            );

        }

        transaction.wallet =
            payload.wallet ||
            transaction.wallet;

        transaction.category =
            payload.category ||
            transaction.category;

        transaction.type =
            payload.type ||
            transaction.type;

        transaction.amount =
            payload.amount ??
            transaction.amount;

        transaction.description =
            payload.description ??
            transaction.description;

        transaction.transactionDate =
            payload.transactionDate ||
            transaction.transactionDate;

        transaction.savingsGoal =
            payload.savingsGoal ??
            transaction.savingsGoal;

        /**
         * Apply new wallet balance
         */
        await updateWalletBalance(
            transaction.wallet,
            transaction.type,
            transaction.amount,
            session
        );

        /**
         * Apply new savings contribution
         */
        if (
            transaction.type === "Expense" &&
            transaction.savingsGoal
        ) {

            await updateSavingsGoal(
                transaction.savingsGoal,
                transaction.amount,
                "add",
                session
            );

        }

        await transaction.save({
            session
        });

        await session.commitTransaction();

        return transaction;

    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        session.endSession();

    }

};

/**
 * Delete Transaction
 */
const deleteTransaction = async (
    id,
    userId
) => {

    const session = await mongoose.startSession();

    session.startTransaction();

    try {

        const transaction = await Transaction.findOne({
            _id: id,
            user: userId
        }).session(session);

        if (!transaction) {

            throw new AppError(
                "Transaction not found",
                404
            );

        }

        /**
         * Reverse wallet balance
         */
        await updateWalletBalance(
            transaction.wallet,
            transaction.type === "Income"
                ? "Expense"
                : "Income",
            transaction.amount,
            session
        );

        /**
         * Reverse savings contribution
         */
        if (
            transaction.type === "Expense" &&
            transaction.savingsGoal
        ) {

            await updateSavingsGoal(
                transaction.savingsGoal,
                transaction.amount,
                "remove",
                session
            );

        }

        await transaction.deleteOne({
            session
        });

        await session.commitTransaction();

    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        session.endSession();

    }

};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};