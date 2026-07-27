const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const SavingsGoal = require("../models/SavingsGoal");
const Budget = require("../models/Budget");

const getDashboard = async (userId) => {

    // Wallets
    const wallets = await Wallet.find({
        user: userId,
        isActive: true
    });

    const totalBalance = wallets.reduce(
        (total, wallet) => total + wallet.balance,
        0
    );

    // Income
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

    // Expense
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

    // Recent Transactions
    const recentTransactions =
        await Transaction.find({
            user: userId,
            isActive: true
        })
            .populate(
                "wallet",
                "name"
            )
            .populate(
                "category",
                "name type color icon"
            )
            .sort({
                transactionDate: -1
            })
            .limit(5);

    // Savings
    const savingsGoals =
        await SavingsGoal.find({
            user: userId,
            isActive: true
        });

    // Budgets
    // Budgets
const budgets =
    await Budget.find({
        user: userId,
        isActive: true
    })
        .populate(
            "category",
            "name color icon"
        );

// Dashboard Totals
const totalIncome =
    income.length
        ? income[0].total
        : 0;

const totalExpense =
    expense.length
        ? expense[0].total
        : 0;

const netBalance =
    totalIncome - totalExpense;

return {

    totalBalance,

    totalIncome,

    totalExpense,

    netBalance,

        activeSavingsGoals:
            savingsGoals.filter(
                goal => !goal.isCompleted
            ).length,

        completedSavingsGoals:
            savingsGoals.filter(
                goal => goal.isCompleted
            ).length,

        totalBudgets:
            budgets.length,

        wallets,

        budgets,

        savingsGoals,

        recentTransactions

    };

};

module.exports = {
    getDashboard
};