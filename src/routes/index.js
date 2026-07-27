const express = require("express");

const authRoutes = require("./auth.routes");
const walletRoutes = require("./wallet.routes");
const categoryRoutes = require("./category.routes");
const transactionRoutes = require("./transaction.routes");
const budgetRoutes = require("./budget.routes");
const savingsRoutes = require("./savings.routes");
const dashboardRoutes = require("./dashboard.routes");
const reportRoutes = require("./report.routes");

const router = express.Router();



router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to GOALSAVE API v1"
    });
});

router.use("/auth", authRoutes);
router.use("/wallets", walletRoutes);
router.use("/categories", categoryRoutes);
router.use("/transactions", transactionRoutes);
router.use("/budgets", budgetRoutes);
router.use("/savings", savingsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/reports", reportRoutes);


module.exports = router;