const categoryService = require("../services/category.service");

const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Create Category
 */
const createCategory = asyncHandler(async (req, res) => {

    const category = await categoryService.createCategory(
        req.body,
        req.user._id
    );

    return ApiResponse.success(
        res,
        "Category created successfully",
        category,
        201
    );

});

/**
 * Get Categories
 */
const getCategories = asyncHandler(async (req, res) => {

    const categories = await categoryService.getCategories(
        req.user._id,
        req.query
    );

    return ApiResponse.success(
        res,
        "Categories retrieved successfully",
        categories.items,
        200,
        categories.pagination
    );

});

/**
 * Get Category By Id
 */
const getCategoryById = asyncHandler(async (req, res) => {

    const category = await categoryService.getCategoryById(
        req.params.id,
        req.user._id
    );

    return ApiResponse.success(
        res,
        "Category retrieved successfully",
        category
    );

});

/**
 * Update Category
 */
const updateCategory = asyncHandler(async (req, res) => {

    const category = await categoryService.updateCategory(
        req.params.id,
        req.body,
        req.user._id
    );

    return ApiResponse.success(
        res,
        "Category updated successfully",
        category
    );

});

/**
 * Delete Category
 */
const deleteCategory = asyncHandler(async (req, res) => {

    await categoryService.deleteCategory(
        req.params.id,
        req.user._id
    );

    return ApiResponse.success(
        res,
        "Category deleted successfully",
        null
    );

});

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};