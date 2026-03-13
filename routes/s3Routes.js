const express = require("express");
const { deleteSingleFile, uploadSingleFile } = require("../controllers/s3Controller");
const upload = require("../middleware/multer");

const Router = express.Router();

Router.post("/upload-single-file", upload.single("file"), uploadSingleFile);
Router.post("/delete-single-file", deleteSingleFile);

module.exports = Router;