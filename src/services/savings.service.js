const SavingsGoal = require("../models/SavingsGoal");
const {
    createNotification
} = require("./notification.service");

const AppError = require("../utils/AppError");
const getQueryFeatures = require("../utils/queryFeatures");


/**
 * Create Savings Goal
 */
const createGoal = async (payload, userId) => {

    if (!payload || !payload.title || !payload.targetAmount) {

        throw new AppError(
            "Title and target amount are required",
            400
        );

    }

    const goal = await SavingsGoal.create({

        user: userId,

        title: payload.title,

        targetAmount: payload.targetAmount,

        currentAmount: 0,

        targetDate: payload.targetDate,

        description: payload.description

    });


    // Create notification
    await createNotification({

        user: userId,

        title: "Savings Goal Created",

        message: `Your savings goal "${goal.title}" has been created successfully.`,

        type: "savings",

        priority: "low",

        relatedModel: "SavingsGoal",

        relatedId: goal._id

    });


    return goal;

};

/**
 * Get Savings Goals
 */
const getGoals = async (userId, query = {}) => {

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

    const goals = await SavingsGoal.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

    return goals.map(goal => {

        const percentage =
            goal.targetAmount === 0
                ? 0
                : Number(
                    (
                        goal.currentAmount /
                        goal.targetAmount
                    ) * 100
                ).toFixed(2);

        return {
            ...goal.toObject(),
            percentage,
            remaining:
                goal.targetAmount -
                goal.currentAmount
        };

    });

};

/**
 * Get Goal By Id
 */
const getGoalById = async (
    id,
    userId
) => {

    const goal = await SavingsGoal.findOne({
        _id: id,
        user: userId,
        isActive: true
    });

    if (!goal) {
        throw new AppError(
            "Savings goal not found",
            404
        );
    }

    return {
        ...goal.toObject(),
        percentage:
            Number(
                (
                    goal.currentAmount /
                    goal.targetAmount
                ) * 100
            ).toFixed(2),
        remaining:
            goal.targetAmount -
            goal.currentAmount
    };

};

/**
 * Update Goal
 */
const updateGoal = async (
    id,
    payload,
    userId
) => {

    const goal = await SavingsGoal.findOne({
        _id: id,
        user: userId,
        isActive: true
    });

    if (!goal) {
        throw new AppError(
            "Savings goal not found",
            404
        );
    }

    const wasCompleted = goal.isCompleted

    if (payload.title) {
        goal.title = payload.title;
    }

    if (payload.targetAmount) {
        goal.targetAmount =
            payload.targetAmount;
    }

    goal.isCompleted =
    goal.currentAmount >= goal.targetAmount;

    if (payload.targetDate) {
        goal.targetDate =
            payload.targetDate;
    }

    if (payload.description !== undefined) {
        goal.description =
            payload.description;
    }

    await goal.save();

    return goal;

};

/**
 * Add Contribution
 */
const contributeToGoal = async (
    id,
    amount,
    userId
) => {
    if (amount <= 0) {

        throw new AppError(
            "Contribution amount must be greater than zero",
            400
        );

    }

    const goal = await SavingsGoal.findOne({
        _id: id,
        user: userId,
        isActive: true
    });

    if (!goal) {
        throw new AppError(
            "Savings goal not found",
            404
        );
    }

    const wasCompleted = goal.isCompleted;

    goal.currentAmount += amount;

if (goal.currentAmount > goal.targetAmount) {
    goal.currentAmount = goal.targetAmount;
}

goal.isCompleted =
    goal.currentAmount >= goal.targetAmount;

    await goal.save();

    if (!wasCompleted && goal.isCompleted) {

        await createNotification({

            user: userId,

            title: "Savings Goal Achieved",

            message: `Congratulations! You have achieved your "${goal.title}" savings goal.`,

            type: "savings",

            priority: "high",

            relatedModel: "SavingsGoal",

            relatedId: goal._id

        });

    }

    return goal;

};

/**
 * Delete Goal
 */
const deleteGoal = async (
    id,
    userId
) => {

    const goal = await SavingsGoal.findOne({
        _id: id,
        user: userId,
        isActive: true
    });

    if (!goal) {
        throw new AppError(
            "Savings goal not found",
            404
        );
    }

    goal.isActive = false;

    await goal.save();

};

module.exports = {
    createGoal,
    getGoals,
    getGoalById,
    updateGoal,
    contributeToGoal,
    deleteGoal
};