const express = require("express");
const { isAdmin, authMiddleware } = require("../middleware/authMiddleware");
const { addColor, getColors, updateColor, deleteColor } = require("../controllers/product/colorController");


const Router = express.Router();


Router.post("/add", authMiddleware, isAdmin, addColor);
Router.get("/list", getColors);
Router.patch("/update/:id", authMiddleware, isAdmin, updateColor);
Router.delete("/delete/:id", authMiddleware, isAdmin, deleteColor);


module.exports = Router;