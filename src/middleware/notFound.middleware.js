const ApiResponse = require("../utils/ApiResponse");

const notFound = (
    req,
    res
) => {

    return ApiResponse.error(
        res,
        `Route ${req.originalUrl} not found`,
        null,
        404
    );

};

module.exports = notFound;