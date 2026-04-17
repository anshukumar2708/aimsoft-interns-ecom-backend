const Color = require("../../models/colorModel");

exports.addColor = async (req, res) => {
    try {
        const {
            name,
            slug,
            image,
            description,
            isActive,
            displayOrder,
        } = req.body;

        // Check duplicate
        const existing = await Color.findOne({
            $or: [
                { name: name },
                { slug: slug }
            ]
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Color already exists",
            });
        }

        const color = new Color({
            name,
            slug,
            image,
            description,
            isActive,
            displayOrder,
        });

        await color.save();

        res.status(201).json({
            success: true,
            message: "Color Added successfully",
            data: color,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getColors = async (req, res) => {
    try {
        const { search, page = 1, limit = 10, isActive } = req.query;

        const filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } }
            ];
        }

        if (isActive !== undefined) {
            filter.isActive = isActive === "true";
        }

        const skip = (Number(page) - 1) * Number(limit);

        const colors = await Color.find(filter)
            .sort({ displayOrder: 1, createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            count: colors.length,
            data: colors,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.updateColor = async (req, res) => {
    try {
        const { id } = req.params;

        const updateData = { ...req.body };

        const color = await Color.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!color) {
            return res.status(404).json({
                success: false,
                message: "Color not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Color updated successfully",
            data: color,
        });
    } catch (error) {
        console.log("Error updating color:", error);
    }
}


exports.deleteColor = async (req, res) => {
    try {
        const { id } = req.params;

        const color = await Color.findByIdAndDelete(id);

        if (!color) {
            return res.status(404).json({
                success: false,
                message: "Color not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Color deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}





