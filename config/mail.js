const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmailOtp = async (email, otp) => {
    try {
        const info = await transporter.sendMail({
            from: `"Ecommerce" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Email Verification OTP",
            text: `Your email verification OTP is ${otp}`,
            html: `
                <h2>Email Verification</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP will expire in 10 minutes.</p>
            `,
        });

        return info;
    } catch (error) {
        console.error("Email send error:", error);
        throw error;
    }
};

module.exports = sendEmailOtp;
