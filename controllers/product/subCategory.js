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
        const { search, page, limit, isActive } = req.query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skipData = (pageNumber - 1) * limitNumber || 0;

        // first method
        // const allSubCategory = await SubCategory.aggregate([
        //     {
        //         $match: {
        //             ...(search && {
        //                 $or: [
        //                     { name: { $regex: search, $options: "i" } },
        //                     { description: { $regex: search, $options: "i" } }
        //                 ]
        //             }),
        //             ...(typeof isActive !== "undefined" && {
        //                 isActive: isActive === "true"
        //             })
        //         }
        //     },
        //     {
        //         $facet: {
        //             data: [
        //                 { $sort: { displayOrder: -1, createdAt: -1 } },
        //                 { $skip: skipData },
        //                 { $limit: limitNumber }
        //             ],
        //             totalCount: [
        //                 { $count: "count" }
        //             ]
        //         }
        //     },
        //     {
        //         $project: {
        //             data: 1,
        //             totalCount: {
        //                 $ifNull: [
        //                     { $arrayElemAt: ["$totalCount.count", 0] },
        //                     0
        //                 ]
        //             }
        //         }
        //     }
        // ]);


        // second method


        const matchStage = {
            ...(search && {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                ]
            }),

            ...(typeof isActive !== "undefined" && {
                isActive: isActive === "true"
            })
        }

        const dataPipeline = [
            { $sort: { displayOrder: -1, createdAt: -1, _id: -1 } }
        ]

        if (limitNumber) {
            dataPipeline.push(
                { $skip: skipData },
                { $limit: limitNumber }
            )
        }

        const [result] = await SubCategory.aggregate([
            { $match: matchStage },
            {
                $facet: {
                    data: dataPipeline,
                    totalCount: [
                        { $count: "count" }
                    ],
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

        return successResponse(res, "Sub category get successfully", responseData);
    } catch (error) {
        console.error("Category create error:", error);
        return errorResponse(res, error.message)
    }
}

