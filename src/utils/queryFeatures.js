const getQueryFeatures = (query) => {

    const page =
        Number(query.page) || 1;

    const limit =
        Number(query.limit) || 10;

    const skip =
        (page - 1) * limit;

    const sort =
        query.sort || "-createdAt";

    return {
        page,
        limit,
        skip,
        sort
    };

};

module.exports = getQueryFeatures;