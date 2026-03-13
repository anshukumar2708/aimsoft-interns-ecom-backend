const { uploadTOS3, deleteFromS3 } = require("../service/s3Services");
const { errorResponse, successResponse } = require("../utils/responseHandler");

exports.uploadSingleFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const result = await uploadTOS3(req.file, "images/categories");

        return successResponse(res, "File uploaded successfully", result);
    } catch (error) {
        console.error("upload controller error", error);
        return errorResponse(res, "Upload single file error", 404);
    }
};

exports.deleteSingleFile = async (req, res) => {
    try {
        const { fileKey } = req.body;


        if (!fileKey) {
            return errorResponse(res, "fileKey is required", 400);
        }

        const result = await deleteFromS3(fileKey);

        return successResponse(res, "File deleted successfully", result);

    } catch (error) {
        console.error("delete controller error", error);
        return errorResponse(res, "Delete single file error", 500);
    }
};
