const dotenv = require("dotenv");
const twilio = require("twilio");

dotenv.config();

const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER,
} = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);


const sendMobileSms = async (mobile, otp) => {
    const message = await client.messages.create({
        body: `Your verification OTP is ${otp}. It will expire in 2 minutes.`,
        from: TWILIO_PHONE_NUMBER,
        to: mobile,
    });
    return message;
}



module.exports = sendMobileSms;