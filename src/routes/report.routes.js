const express = require("express");

const authenticate = require("../middleware/auth.middleware");

const reportController = require("../controllers/report.controller");

const router = express.Router();

router.use(authenticate);

router.get(
    "/monthly",
    reportController.getMonthlyReport
);

router.get(
    "/categories",
    reportController.getCategoryReport
);

module.exports = router;