const savingsService = require("../services/savings.service");

const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Create Savings Goal
 */
const createGoal = asyncHandler(async (req, res) => {

    const goal = await savingsService.createGoal(
        req.body,
        req.user._id
    );

    return ApiResponse.success(
        res,
        "Savings goal created successfully",
        goal,
        201
    );

});

/**
 * Get Savings Goals
 */
const getGoals = asyncHandler(async (req, res) => {

    const goals = await savingsService.getGoals(
        req.user._id,
        req.query
    );

    return ApiResponse.success(
        res,
        "Savings goals retrieved successfully",
        goals
    );

});

/**
 * Get Goal By Id
 */
const getGoalById = asyncHandler(async (req, res) => {

    const goal = await savingsService.getGoalById(
        req.params.id,
        req.user._id
    );

    return ApiResponse.success(
        res,
        "Savings goal retrieved successfully",
        goal
    );

});

/**
 * Update Goal
 */
const updateGoal = asyncHandler(async (req, res) => {

    const goal = await savingsService.updateGoal(
        req.params.id,
        req.body,
        req.user._id
    );

    return ApiResponse.success(
        res,
        "Savings goal updated successfully",
        goal
    );

});

/**
 * Contribute To Goal
 */
const contributeToGoal = asyncHandler(async (req, res) => {

    const goal = await savingsService.contributeToGoal(
        req.params.id,
        req.body.amount,
        req.user._id
    );

    return ApiResponse.success(
        res,
        "Contribution added successfully",
        goal
    );

});

/**
 * Delete Goal
 */
const deleteGoal = asyncHandler(async (req, res) => {

    await savingsService.deleteGoal(
        req.params.id,
        req.user._id
    );

    return ApiResponse.success(
        res,
        "Savings goal deleted successfully",
        null
    );

});

module.exports = {
    createGoal,
    getGoals,
    getGoalById,
    updateGoal,
    contributeToGoal,
    deleteGoal
};