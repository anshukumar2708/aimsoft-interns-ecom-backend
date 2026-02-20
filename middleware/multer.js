const multer = required("multer");

const store = multer.memoryStorage();

const upload = multer({
    storage: store,
    limits: { filesize: 0.5 * 1024 * 1024 }
});



module.exports = upload;