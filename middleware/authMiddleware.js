const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const { headers } = req;

    let token;

    if (headers.authorization && headers.authorization.startsWith("Bearer")) {
        token = headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(400).json({
            status: "fail",
            message: "Token required"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded?._id) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid token"
            })
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(500).json({
            status: "success",
            message: `middleware error ${error.message}`
        })
    }

}