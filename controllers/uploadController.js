const uploadTOS3 = require(".././service/s3Upload");

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const result = await uploadTOS3(req.file, "images");

        res.status(200).json({
            message: "File uploaded successfully",
            data: result,
        });
    } catch (error) {
        console.error("upload controller error", error);
        res.status(500).json({ message: "Upload failed", error: error.message });
    }
};
