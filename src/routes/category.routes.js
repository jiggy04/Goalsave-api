const express = require("express");

const categoryController = require("../controllers/category.controller");

const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const {
    createCategorySchema,
    updateCategorySchema
} = require("../validators/category.validator");

const router = express.Router();

router.use(authenticate);

router.post(
    "/",
    validate(createCategorySchema),
    categoryController.createCategory
);

router.get(
    "/",
    categoryController.getCategories
);

router.get(
    "/:id",
    categoryController.getCategoryById
);

router.patch(
    "/:id",
    validate(updateCategorySchema),
    categoryController.updateCategory
);

router.delete(
    "/:id",
    categoryController.deleteCategory
);

module.exports = router;