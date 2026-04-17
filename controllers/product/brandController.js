const Brand = require("../../models/brandModel");

exports.addBrand = async (req, res) => {
    try {
        const {
            name,
            slug,
            image,
            categoryId,
            subCategoryId,
            description,
            isActive,
            displayOrder,
        } = req.body;

        // Check duplicate
        const existing = await Brand.findOne({
            $or: [
                { name: name },
                { slug: slug }
            ]
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Brand already exists",
            });
        }

        const brand = new Brand({
            name,
            slug,
            image,
            categoryId,
            subCategoryId,
            description,
            isActive,
            displayOrder,
        });

        await brand.save();

        res.status(201).json({
            success: true,
            message: "Brand created successfully",
            data: brand,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getBrands = async (req, res) => {
    try {
        const brands = await Brand.find()
            .populate("categoryId", "name slug")
            .populate("subCategoryId", "name slug")
            .sort({ displayOrder: 1 });

        res.status(200).json({
            success: true,
            count: brands.length,
            data: brands,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;

        const brand = await Brand.findByIdAndDelete(id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Brand deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.updateBrand = async (req, res) => {
    try {
        const { id } = req.params;

        const updateData = { ...req.body };

        const brand = await Brand.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Brand updated successfully",
            data: brand,
        });
    } catch (error) {
        console.log("Error updating brand:", error);
    }
}




