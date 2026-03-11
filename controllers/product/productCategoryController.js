const ProductCategory = require("../../models/productCategoryModel");

exports.addProductCategory = async (req, res) => {
    try {
        const payLoad = req.body;
        const newCategory = new ProductCategory(payLoad);
        const savedCategory = await newCategory.save();
        return res.status(200).json({
            status: "success",
            message: "Category added successfully",
            data: savedCategory
        })
    } catch (error) {
        console.error("Category create error:", error);
        return res.status(500).json({
            status: "error",
            message: error?.message
        })
    }

}

exports.getProductCategory = async (req, res) => {
    try {
        const allProductCategory = await ProductCategory.find();
        return res.status(200).json({
            status: "success",
            message: "Category get successfully",
            data: allProductCategory
        })
    } catch (error) {
        console.error("Category get error:", error);
        return res.status(500).json({
            status: "error",
            message: error?.message
        })
    }
}

exports.deleteProductCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await ProductCategory.findByIdAndDelete({ _id: id });
        return res.status(200).json({
            status: "success",
            message: "Category delete successfully",
            data: deletedCategory
        })
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error?.message
        })
    }
}

