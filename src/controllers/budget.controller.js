const budgetService = require("../services/budget.service");

const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const createBudget = asyncHandler(async (req, res) => {

    const budget = await budgetService.createBudget(
        req.body,
        req.user._id
    );

    return ApiResponse.success(
        res,
        "Budget created successfully",
        budget,
        201
    );

});

const getBudgets = asyncHandler(async (req, res) => {

    const budgets = await budgetService.getBudgets(
        req.user._id,
        req.query
    );

    return ApiResponse.success(
        res,
        "Budgets retrieved successfully",
        budgets.items,
        200,
        budgets.pagination
    );

});

const getBudgetById = asyncHandler(async (req, res) => {

    const budget = await budgetService.getBudgetById(
        req.params.id,
        req.user._id
    );

    return ApiResponse.success(
        res,
        "Budget retrieved successfully",
        budget
    );

});

const updateBudget = asyncHandler(async (req, res) => {

    const budget = await budgetService.updateBudget(
        req.params.id,
        req.body,
        req.user._id
    );

    return ApiResponse.success(
        res,
        "Budget updated successfully",
        budget
    );

});

const deleteBudget = asyncHandler(async (req, res) => {

    await budgetService.deleteBudget(
        req.params.id,
        req.user._id
    );

    return ApiResponse.success(
        res,
        "Budget deleted successfully",
        null
    );

});

module.exports = {
    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget
};