const express = require("express");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const { addProductCategory, getProductCategory, deleteProductCategory, updateProductCategory } = require("../controllers/product/productCategoryController");
const { addProductSubCategory, getProductSubCategory } = require("../controllers/product/subCategory");


const Router = express.Router();

// product categories routes
Router.post("/category", authMiddleware, isAdmin, addProductCategory);

Router.get("/category", authMiddleware, getProductCategory);

Router.delete("/category/:id", authMiddleware, deleteProductCategory);

Router.patch("/category/:id", authMiddleware, isAdmin, updateProductCategory);


// product sub categories routes
Router.post("/sub-category", authMiddleware, isAdmin, addProductSubCategory);

Router.get("/sub-category", authMiddleware, getProductSubCategory);


module.exports = Router;