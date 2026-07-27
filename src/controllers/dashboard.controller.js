const dashboardService = require("../services/dashboard.service");

const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getDashboard = asyncHandler(async (req, res) => {

    const dashboard =
        await dashboardService.getDashboard(
            req.user._id
        );

    return ApiResponse.success(
        res,
        "Dashboard retrieved successfully",
        dashboard
    );

});

module.exports = {
    getDashboard
};