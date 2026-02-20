const express = require("express");
const { uploadFile } = require("../controllers/uploadController");
const upload = require("../middleware/multer");

const Router = express.Router();

Router.post("/upload", upload.single("file"), uploadFile);

module.exports = Router;