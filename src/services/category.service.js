const Category = require("../models/Category");

const AppError = require("../utils/AppError");
const getQueryFeatures = require("../utils/queryFeatures");

const createCategory = async (payload, userId) => {
    if (!payload || !payload.name || !payload.type) {

        throw new AppError(
            "Category name and type are required",
            400
        );

    }

    const existingCategory = await Category.findOne({
        user: userId,
        name: payload.name.trim(),
        type: payload.type,
        isActive: true
    });

    if (existingCategory) {
        throw new AppError(
            "Category already exists",
            409
        );
    }

    const category = await Category.create({
        user: userId,
        name: payload.name.trim(),
        type: payload.type,
        color: payload.color || "#25633EB",
        icon: payload.icon || "folder"
    });

    return category;

};

const getCategories = async (userId, query = {}) => {

    const filter = {
        user: userId,
        isActive: true
    };

    if (query.type) {
        filter.type = query.type;
    }

    if (query.search) {
        filter.name = {
            $regex: query.search,
            $options: "i"
        };
    }

    const {
        limit,
        skip,
        sort
    } = getQueryFeatures(query);

    return await Category.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

};

const getCategoryById = async (id, userId) => {

    const category = await Category.findOne({
        _id: id,
        user: userId,
        isActive: true
    });

    if (!category) {
        throw new AppError(
            "Category not found",
            404
        );
    }

    return category;

};

const updateCategory = async (
    id,
    payload,
    userId
) => {

    const category = await Category.findOne({
        _id: id,
        user: userId,
        isActive: true
    });

    if (!category) {
        throw new AppError(
            "Category not found",
            404
        );
    }

    if (payload.name) {

        const existingCategory = await Category.findOne({
            user: userId,
            name: payload.name.trim(),
            type: payload.type || category.type,
            isActive: true,
            _id: { $ne: id }
        });

        if (existingCategory) {
            throw new AppError(
                "Category already exists",
                409
            );
        }

        category.name = payload.name.trim();

    }

    if (payload.type) {
        category.type = payload.type;
    }

    if (payload.color) {
        category.color = payload.color;
    }

    if (payload.icon) {
        category.icon = payload.icon;
    }

    await category.save();

    return category;

};

const deleteCategory = async (id, userId) => {

    const category = await Category.findOne({
        _id: id,
        user: userId,
        isActive: true
    });

    if (!category) {
        throw new AppError(
            "Category not found",
            404
        );
    }

    category.isActive = false;

    await category.save();

};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};