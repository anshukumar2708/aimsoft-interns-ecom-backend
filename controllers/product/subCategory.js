const SubCategory = require("../../models/subCategoryModel");
const { errorResponse, successResponse } = require("../../utils/responseHandler");

exports.addProductSubCategory = async (req, res) => {
    try {
        const { name, slug, ...rest } = req.body;

        const existing = await SubCategory.findOne({
            $or: [{ name }, { slug }]
        })

        if (existing) {
            if (existing.name === name) {
                return errorResponse(res, `${name} already exists`, 400);
            }
            if (existing.slug === slug) {
                return errorResponse(res, `${slug} already exists`, 400);
            }
        }

        // Create new subcategory
        const newSubCategory = await SubCategory.create({
            name,
            slug,
            ...rest
        });

        return successResponse(
            res,
            "Sub category added successfully",
            newSubCategory
        );

    } catch (error) {
        console.error("Category create error:", error);
        return errorResponse(res, error.message);
    }
};

exports.getProductSubCategory = async (req, res) => {
    try {
        const allSubCategory = await SubCategory.find();
        return successResponse(res, "Sub category get successfully", allSubCategory);
    } catch (error) {
        console.error("Category create error:", error);
        return errorResponse(res, error.message)
    }
}