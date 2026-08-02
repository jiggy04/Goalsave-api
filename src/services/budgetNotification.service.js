const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

const {
    createNotification
} = require("./notification.service");

const checkBudgetThreshold = async (
    userId,
    categoryId
) => {

    const today = new Date();

    const budget = await Budget.findOne({
        user: userId,
        category: categoryId,
        isActive: true,
        startDate: { $lte: today },
        endDate: { $gte: today }
    });

    if (!budget) {
        return;
    }

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

    const spent = result.length
        ? result[0].spent
        : 0;

    const percentage =
    budget.amount === 0
        ? 0
        : (spent / budget.amount) * 100;

        
        if (
            percentage >= 80 &&
            percentage < 100 &&
            !budget.warningSent
        ) {

            await createNotification({

                user: userId,

                title: "Budget Warning",

                message: `You have used ${percentage.toFixed(0)}% of your "${budget.title}" budget.`,

                type: "budget",

                priority: "medium",

                relatedModel: "Budget",

                relatedId: budget._id

            });

            budget.warningSent = true;

            await budget.save();

        }

        if (
            percentage >= 100 &&
            !budget.exceededNotificationSent
        ) {

            await createNotification({

                user: userId,

                title: "Budget Exceeded",

                message: `You have exceeded your "${budget.title}" budget.`,

                type: "budget",

                priority: "high",

                relatedModel: "Budget",

                relatedId: budget._id

            });

            budget.exceededNotificationSent = true;

            await budget.save();

        }

    return {
        budget,
        spent,
        percentage
    };

};

module.exports = {
    checkBudgetThreshold
};