const validateEnv = () => {

    const required = [

        "PORT",

        "MONGODB_URI",

        "JWT_SECRET",

        "JWT_EXPIRES_IN"

    ];

    const missing = required.filter(
        (key) => !process.env[key]
    );

    if (missing.length) {

        throw new Error(
            `Missing environment variables: ${missing.join(", ")}`
        );

    }

};

module.exports = validateEnv;