const multer = require("multer");

const store = multer.memoryStorage();

const upload = multer({
    storage: store,
    limits: { fileSize: 0.5 * 1024 * 1024 } // 500 KB
});

module.exports = upload;