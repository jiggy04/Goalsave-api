const ApiResponse = require("../utils/ApiResponse");

const errorHandler = (
    err,
    req,
    res,
    next
) => {

    console.error(err);

    const statusCode =
        err.statusCode || 500;

    return ApiResponse.error(
        res,
        err.message || "Internal Server Error",
        process.env.NODE_ENV === "development"
            ? err.stack
            : null,
        statusCode
    );

};

module.exports = errorHandler;