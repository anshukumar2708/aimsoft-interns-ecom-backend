const ProductCategory = require("../../models/productCategoryModel");
const { successResponse, errorResponse } = require("../../utils/responseHandler");

exports.addProductCategory = async (req, res) => {
    try {

        const { name, slug, ...rest } = req.body;

        const existing = await ProductCategory.findOne({
            $or: [
                { name },
                { slug }
            ]
        })

        if (existing) {
            if (existing.name === name) {
                return errorResponse(res, `${name} already added`, 400);
            }
            if (existing.slug === slug) {
                return errorResponse(res, `${slug} slug already added`, 400);
            }
        }

        const savedCategory = await ProductCategory.create({
            name,
            slug,
            ...rest
        });

        return successResponse(res, "Category added successfully", savedCategory);
    } catch (error) {
        console.error("Category create error:", error);
        return errorResponse(res, error.message);
    }
};

exports.getProductCategory = async (req, res) => {
    try {
        const { search, page, limit, isActive } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skipData = (pageNumber - 1) * limitNumber;

        const matchStage = {
            ...(search && {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                ],
            }),
            ...(typeof isActive !== "undefined" && {
                isActive: isActive,
            }),
        };

        const dataPipeline = [
            { $sort: { createdAt: -1, _id: -1, displayOrder: -1 } }
        ];

        // Apply pagination only if limitNumber exists
        if (limitNumber) {
            dataPipeline.push(
                { $skip: skipData || 0 },
                { $limit: limitNumber }
            );
        }

        dataPipeline.push({
            $project: {
                createdAt: 1,
                description: 1,
                displayOrder: 1,
                image: 1,
                isActive: 1,
                name: 1,
                updatedAt: 1,
            },
        });

        // First Method separate
        // const totalCount = await ProductCategory.countDocuments(matchStage);
        // const allProductCategory = await ProductCategory.find(filter)
        //     .skip(skipData)
        //     .limit(limitNumber)
        //     .sort({ createdAt: -1 })
        //     .lean();

        // Second Method
        // const [totalCount, allProductCategory] = await Promise.all([
        //     ProductCategory.countDocuments(matchStage),
        //     ProductCategory.find(matchStage)
        //         .skip(skipData)
        //         .limit(limitNumber)
        //         .sort({ createdAt: -1 })
        //         .lean()
        // ])

        // Third method by aggregation method
        const [result] = await ProductCategory.aggregate([
            { $match: matchStage },
            {
                $facet: {
                    data: dataPipeline,
                    totalCount: [{ $count: "count" }],
                },
            },
            {
                $project: {
                    data: 1,
                    totalCount: {
                        $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
                    },
                },
            },
        ]);
        const responseData = {
            data: result?.data,
            currentPage: Number(page),
            totalCount: result?.totalCount,
            totalPages: Math.ceil(result?.totalCount / limitNumber),
        }

        return successResponse(res, "Category get successfully", responseData);

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
