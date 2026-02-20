const bcrypt = require("bcryptjs");
const sendEmailOtp = require("../config/mail");
const User = require("../models/userModel");
const sendMobileSms = require("../config/twilio");

exports.registration = async (req, res) => {
    try {
        const { name, email, mobile, password, confirmPassword } = req.body;

        // 1. Basic request validation
        if (!name || !email || !mobile || !password || !confirmPassword) {
            return res.status(400).json({
                status: "fail",
                message: "All required fields must be provided"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                status: "fail",
                message: "Password and confirm password not matched"
            })
        }

        const existingUser = await User.findOne({
            $or: [
                { email },
                { mobile }
            ]
        })

        if (existingUser) {
            return res.status(400).json({
                status: "fail",
                message: "User already registered with this email or mobile"
            })
        }

        const newUser = await User.create({
            name,
            email,
            mobile,
            password,
        });

        const token = await newUser.generateToken();

        const userObj = newUser.toObject();

        delete userObj.password;

        res.status(200).json({
            status: "success",
            message: "Registration successfully",
            token: token,
            data: userObj
        })

    } catch (error) {
        // Mongoose validation error
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                status: "fail",
                errors
            });
        }

        // Duplicate key error (unique fields)
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                status: "fail",
                message: `${field} '${error.keyValue[field]}' already exists`
            });
        }

        // Other errors
        res.status(500).json({
            status: error,
            message: error.message
        })
    }

}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Email and password are required"
            })
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({
                status: "success",
                message: "Invalid Credential",
            })
        }

        const isPasswordMatched = await existingUser.isPasswordMatched(password);

        if (!isPasswordMatched) {
            return res.status(400).json({
                status: "success",
                message: "Invalid Credential",
            })
        }

        const token = await existingUser.generateToken();

        const userObj = existingUser.toObject();

        delete userObj.password

        return res.status(200).json({
            status: "success",
            message: "Login successful",
            token: token,
            data: userObj
        })

    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: `Login error ${error.message}`
        })
    }
}

exports.sendEmailOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json(
                {
                    status: "fail",
                    message: "Email is required"
                }
            );
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json(
                {
                    status: "fail",
                    message: "Please enter valid email"
                });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        const hashOtp = bcrypt.hashSync(otp.toString(), 10);

        await sendEmailOtp(email, otp);

        // Update OTP & expiry directly
        await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    otp: {
                        code: hashOtp,
                        expireAt: new Date(Date.now() + 2 * 60 * 1000),
                    },
                },
            },
            { new: true }
        );

        return res.status(200).json(
            {
                status: "success",
                message: "Email send Successfully, please check your mail"
            }
        )
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: `Otp send error ${error}`
        })
    }

}

exports.verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                status: "fail",
                message: "Email and OTP code are required",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser.isEmailVerified) {
            return res.status(400).json({
                status: "fail",
                message: "Email already verified",
            });
        }

        if (!existingUser || !existingUser.otp?.code) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid email",
            });
        }

        if (existingUser.otp.expireAt < Date.now()) {
            return res.status(400).json({
                status: "fail",
                message: "OTP has expired",
            });
        }

        const isOtpMatched = await bcrypt.compare(
            String(code),
            existingUser.otp.code
        );

        if (!isOtpMatched) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid OTP",
            });
        }

        await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    isEmailVerified: true,
                    otp: {
                        code: null,
                        expireAt: null
                    }
                },

            }
        )

        return res.status(200).json({
            status: "success",
            message: "Email verified successfully",
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Email verification failed",
        });
    }
};

exports.sendMobileOtp = async (req, res) => {
    try {
        const { mobile } = req.body;

        if (!mobile) {
            return res.status(400).json({
                status: "error",
                message: "Phone number is required",
            });
        }

        const existingUser = await User.findOne({ mobile });

        if (!existingUser) {
            return res.status(400).json({
                status: "error",
                message: "Please enter valid phone number",
            });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        const hashOtp = bcrypt.hashSync(otp.toString(), 10);

        const info = await sendMobileSms(mobile, otp);

        // Update OTP & expiry directly
        await User.findOneAndUpdate(
            { mobile },
            {
                $set: {
                    otp: {
                        code: hashOtp,
                        expireAt: new Date(Date.now() + 2 * 60 * 1000),
                    },
                },
            },
            { new: true }
        );

        console.log("info", info);

        return res.status(200).json(
            {
                status: "success",
                message: "Otp send Successfully, please check your mobile"
            }
        )

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: `Mobile otp send failed ${error.message}`,
        });
    }
}


exports.verifyMobile = async (req, res) => {
    try {
        const { mobile, code } = req.body;

        if (!mobile || !code) {
            return res.status(400).json({
                status: "fail",
                message: "Phone Number and OTP code are required",
            });
        }

        const existingUser = await User.findOne({ mobile });

        if (existingUser.isMobileVerified) {
            return res.status(400).json({
                status: "fail",
                message: "Phone number already verified",
            });
        }

        if (!existingUser || !existingUser.otp?.code) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid mobile",
            });
        }

        if (existingUser.otp.expireAt < Date.now()) {
            return res.status(400).json({
                status: "fail",
                message: "OTP has expired",
            });
        }

        const isOtpMatched = await bcrypt.compare(
            String(code),
            existingUser.otp.code
        );

        if (!isOtpMatched) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid OTP",
            });
        }

        await User.findOneAndUpdate(
            { mobile },
            {
                $set: {
                    isMobileVerified: true,
                    otp: {
                        code: null,
                        expireAt: null
                    }
                },

            }
        )

        return res.status(200).json({
            status: "success",
            message: "Phone number verified successfully",
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Phone number verification failed",
        });
    }
};

exports.loginWithGoogle = async (req, res) => {

}

exports.loginWithFaceBook = async (req, res) => {

}