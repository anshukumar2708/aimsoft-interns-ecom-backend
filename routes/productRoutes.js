const express = require("express");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const { addProductCategory, getProductCategory, deleteProductCategory, updateProductCategory } = require("../controllers/product/productCategoryController");
const { addProductSubCategory, getProductSubCategory, deleteProductSubCategory, updateProductSubCategory } = require("../controllers/product/subCategory");


const Router = express.Router();

// product categories routes
Router.post("/category", authMiddleware, isAdmin, addProductCategory);

Router.get("/category", authMiddleware, getProductCategory);

Router.delete("/category/:id", authMiddleware, deleteProductCategory);

Router.patch("/category/:id", authMiddleware, isAdmin, updateProductCategory);


// product sub categories routes
Router.post("/sub-category", authMiddleware, isAdmin, addProductSubCategory);

Router.get("/sub-category", authMiddleware, getProductSubCategory);

Router.delete("/sub-category/:id", authMiddleware, isAdmin, deleteProductSubCategory);

Router.patch("/sub-category/:id", authMiddleware, isAdmin, updateProductSubCategory);


module.exports = Router;