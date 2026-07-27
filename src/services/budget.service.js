const Budget = require("../models/Budget");
const Category = require("../models/Category");
const Transaction = require("../models/Transaction");

const AppError = require("../utils/AppError");
const getQueryFeatures = require("../utils/queryFeatures");

/**
 * Calculate Budget Statistics
 */
const calculateBudgetStats = async (budget) => {

    const result = await Transaction.aggregate([
        {
            $match: {
                user: budget.user,
                category: budget.category,
                type: "Expense",
                transactionDate: {
                    $gte: budget.startDate,
                    $lte: budget.endDate
                }
            }
        },
        {
            $group: {
                _id: null,
                spent: {
                    $sum: "$amount"
                }
            }
        }
    ]);

    const spent = result.length ? result[0].spent : 0;

    const remaining = Math.max(
        budget.amount - spent,
        0
    );

    const percentageUsed =
        budget.amount === 0
            ? 0
            : Number(
                (
                    (spent / budget.amount) *
                    100
                ).toFixed(2)
            );

    let status = "Active";

    const today = new Date();

    if (spent >= budget.amount) {

        status = "Completed";

    } else if (today > budget.endDate) {

        status = "Expired";

    }

    if (budget.status !== status) {

        budget.status = status;

        await budget.save();

    }

    return {
        ...budget.toObject(),
        spent,
        remaining,
        percentageUsed
    };

};

/**
 * Create Budget
 */
const createBudget = async (
    payload,
    userId
) => {

    const category = await Category.findOne({
        _id: payload.category,
        user: userId,
        type: "Expense",
        isActive: true
    });

    if (!category) {
        throw new AppError(
            "Category not found",
            404
        );
    }

    const overlap = await Budget.findOne({
        user: userId,
        category: payload.category,
        isActive: true,
        startDate: {
            $lte: payload.endDate
        },
        endDate: {
            $gte: payload.startDate
        }
    });

    if (overlap) {
        throw new AppError(
            "A budget already exists for this period",
            409
        );
    }

    return await Budget.create({
        user: userId,
        category: payload.category,
        title: payload.title,
        amount: payload.amount,
        startDate: payload.startDate,
        endDate: payload.endDate
    });

};

/**
 * Get Budgets
 */
const getBudgets = async (
    userId,
    query
) => {

    const filter = {
        user: userId,
        isActive: true
    };

    if (query.search) {

        filter.title = {
            $regex: query.search,
            $options: "i"
        };

    }

    const {
        limit,
        skip,
        sort
    } = getQueryFeatures(query);

    const budgets = await Budget.find(filter)
        .populate(
            "category",
            "name color icon"
        )
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const response = [];

    for (const budget of budgets) {

        response.push(
            await calculateBudgetStats(
                budget
            )
        );

    }

    return response;

};

/**
 * Get Budget By Id
 */
const getBudgetById = async (
    id,
    userId
) => {

    const budget = await Budget.findOne({
        _id: id,
        user: userId,
        isActive: true
    }).populate(
        "category",
        "name color icon"
    );

    if (!budget) {

        throw new AppError(
            "Budget not found",
            404
        );

    }

    return await calculateBudgetStats(
        budget
    );

};

/**
 * Update Budget
 */
const updateBudget = async (
    id,
    payload,
    userId
) => {

    const budget = await Budget.findOne({
        _id: id,
        user: userId,
        isActive: true
    });

    if (!budget) {

        throw new AppError(
            "Budget not found",
            404
        );

    }

    if (payload.category) {

        const category =
            await Category.findOne({
                _id: payload.category,
                user: userId,
                type: "Expense",
                isActive: true
            });

        if (!category) {

            throw new AppError(
                "Category not found",
                404
            );

        }

        budget.category =
            payload.category;

    }

    if (payload.title) {
        budget.title = payload.title;
    }

    if (payload.amount) {
        budget.amount = payload.amount;
    }

    if (payload.startDate) {
        budget.startDate =
            payload.startDate;
    }

    if (payload.endDate) {
        budget.endDate =
            payload.endDate;
    }

    await budget.save();

    return await calculateBudgetStats(
        budget
    );

};

/**
 * Delete Budget
 */
const deleteBudget = async (
    id,
    userId
) => {

    const budget = await Budget.findOne({
        _id: id,
        user: userId,
        isActive: true
    });

    if (!budget) {

        throw new AppError(
            "Budget not found",
            404
        );

    }

    budget.isActive = false;

    await budget.save();

};

module.exports = {
    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget
};