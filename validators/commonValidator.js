const { body } = require("express-validator")

/* Name Validator */
exports.nameValidator = (field = "name") => {
    return body(field)
        .trim()
        .notEmpty()
        .withMessage(`${field} is required`)
        .bail()
        .isLength({ min: 3, max: 20 })
        .withMessage(`${field} must be between 3 and 20 characters`);
};

/* Email Validator */
exports.emailValidator = (field = "email") => {
    return body(field)
        .trim()
        .notEmpty()
        .withMessage(`${field} is required`)
        .bail()
        .isEmail()
        .withMessage("Invalid email format");

}

/* Password Validator */
exports.passwordValidator = (field = "password") => {
    return body(field)
        .trim()
        .notEmpty()
        .withMessage(`${field} is required`)
        .bail()
        .isLength({ min: 8, max: 12 })
        .withMessage(`${field} must be between 8 and 12 characters`);
};

exports.confirmPasswordValidator = (
    field = "confirmPassword",
    matchField = "password"
) => {
    return body(field)
        .trim()
        .notEmpty()
        .withMessage(`${field} is required`)
        .bail()
        .custom((value, { req }) => {
            if (value !== req.body[matchField]) {
                throw new Error(`${field} must match with ${matchField}`);
            }
            return true;
        })
}