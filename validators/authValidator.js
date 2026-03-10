const { passwordValidator, confirmPasswordValidator } = require("./commonValidator");


exports.changePasswordValidator = [
    passwordValidator("newPassword"),
    confirmPasswordValidator("confirmPassword", "newPassword")
];

