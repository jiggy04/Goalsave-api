class ApiResponse {

    static success(
        res,
        message,
        data = null,
        statusCode = 200
    ) {

        return res.status(statusCode).json({

            success: true,
            message,
            data,
            errors: null

        });

    }

    static error(
        res,
        message,
        errors = null,
        statusCode = 500
    ) {

        return res.status(statusCode).json({

            success: false,
            message,
            data: null,
            errors

        });

    }

}

module.exports = ApiResponse;