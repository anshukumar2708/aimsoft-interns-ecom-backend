const express = require("express");
const { addProductCategory, getProductCategory, deleteProductCategory } = require("../controllers/product/productCategoryController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");


const Router = express.Router();


Router.post("/add-category", authMiddleware, isAdmin, addProductCategory);

Router.get("/category", authMiddleware, getProductCategory);

Router.delete("/category/:id", authMiddleware, deleteProductCategory);


module.exports = Router;