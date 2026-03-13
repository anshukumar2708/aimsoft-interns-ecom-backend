const ProductCategory = require("../../models/productCategoryModel");
const { options } = require("../../routes/productRoutes");
const { successResponse, errorResponse } = require("../../utils/responseHandler");

exports.addProductCategory = async (req, res) => {
    try {
        const payLoad = req.body;
        const newCategory = new ProductCategory(payLoad);
        const savedCategory = await newCategory.save();
        return successResponse(res, "Category added successfully", savedCategory);
    } catch (error) {
        console.error("Category create error:", error);
        return errorResponse(res, error.message)
    }

}

exports.getProductCategory = async (req, res) => {
    try {
        const { search, page, limit } = req.query;

        const filter = {};

        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 10;
        const skipData = (pageNumber - 1) * limitNumber;

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ]
        }

        const allProductCategory = await ProductCategory.find(filter).skip(skipData).limit(limitNumber);

        return successResponse(res, "Category get successfully", allProductCategory);

    } catch (error) {
        console.error("Category get error:", error);
        return errorResponse(res, error.message);
    }
}

exports.deleteProductCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCategory = await ProductCategory.findByIdAndDelete({ _id: id });

        // check if category exists
        if (!deletedCategory) {
            return errorResponse(res, "Category not found", 404);
        }

        return successResponse(res, "Category delete successfully", deletedCategory);

    } catch (error) {
        return errorResponse(res, error.message);
    }
}

exports.updateProductCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const payLoad = req.body;

        const updateCategory = await ProductCategory.findByIdAndUpdate(
            id,
            payLoad,
            { new: true, runValidators: true }
        );

        if (!updateCategory) {
            return errorResponse(res, "Category not found", 404);
        }

        return successResponse(res, "Category update successfully", updateCategory);
    } catch (error) {
        return errorResponse(res, error.message);
    }
}
