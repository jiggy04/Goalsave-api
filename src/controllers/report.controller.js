const reportService = require("../services/report.service");

const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Monthly Report
 */
const getMonthlyReport = asyncHandler(async (req, res) => {

    const report =
        await reportService.getMonthlyReport(
            req.user._id
        );

    return ApiResponse.success(
        res,
        "Monthly report generated successfully",
        report
    );

});

/**
 * Category Report
 */
const getCategoryReport = asyncHandler(async (req, res) => {

    const report =
        await reportService.getCategoryReport(
            req.user._id
        );

    return ApiResponse.success(
        res,
        "Category report generated successfully",
        report
    );

});

module.exports = {
    getMonthlyReport,
    getCategoryReport
};