const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3Client");

exports.uploadTOS3 = async (file, folder = "images") => {
    try {
        const fileKey = `${folder}/${Date.now()}-${file.originalname}`;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await s3.send(command);

        return {
            key: fileKey,
            url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
        };

    } catch (error) {
        console.error("S3 Upload Error:", error);
        throw new Error("File upload to S3 failed");
    }
};

exports.deleteFromS3 = async (fileKey) => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey   // ✅ FIXED HERE
        });

        await s3.send(command);

        return true;

    } catch (error) {
        console.error("S3 delete Error:", error);
        throw new Error("File delete from S3 failed");
    }
};

