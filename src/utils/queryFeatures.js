const getQueryFeatures = (query = {}) => {

    const page =
        Math.max(Number(query.page) || 1, 1);

    const limit =
        Math.max(Number(query.limit) || 10, 1);

    const skip =
        (page - 1) * limit;

    const sortField =
        query.sort || "createdAt";

    const order =
        query.order === "asc"
            ? 1
            : -1;

    const sort = {
        [sortField]: order
    };

    const search =
        query.search
            ? query.search.trim()
            : "";

    return {
        page,
        limit,
        skip,
        sort,
        search
    };

};

module.exports = getQueryFeatures;