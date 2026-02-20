const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3Client");

const uploadTOS3 = async (file, folder = "uploads") => {
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
};

module.exports = uploadTOS3;
