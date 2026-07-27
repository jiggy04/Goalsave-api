const Transaction = require("../models/Transaction");

/**
 * Monthly Report
 */
const getMonthlyReport = async (userId) => {

    const income = await Transaction.aggregate([
        {
            $match: {
                user: userId,
                type: "Income",
                isActive: true
            }
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$amount"
                }
            }
        }
    ]);

    const expense = await Transaction.aggregate([
        {
            $match: {
                user: userId,
                type: "Expense",
                isActive: true
            }
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$amount"
                }
            }
        }
    ]);

    const totalIncome =
        income.length
            ? income[0].total
            : 0;

    const totalExpense =
        expense.length
            ? expense[0].total
            : 0;

    return {
        income: totalIncome,
        expense: totalExpense,
        balance: totalIncome - totalExpense
    };

};

/**
 * Category Report
 */
const getCategoryReport = async (userId) => {

    return await Transaction.aggregate([

        {
            $match: {
                user: userId,
                type: "Expense",
                isActive: true
            }
        },

        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
            }
        },

        {
            $unwind: "$category"
        },

        {
            $group: {

                _id: "$category.name",

                total: {
                    $sum: "$amount"
                }

            }
        },

        {
            $sort: {
                total: -1
            }
        }

    ]);

};

module.exports = {
    getMonthlyReport,
    getCategoryReport
};