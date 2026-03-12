const express = require("express");
const { addProductCategory, getProductCategory, deleteProductCategory, updateProductCategory } = require("../controllers/product/productCategoryController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");


const Router = express.Router();


Router.post("/category", authMiddleware, isAdmin, addProductCategory);

Router.get("/category", authMiddleware, getProductCategory);

Router.delete("/category/:id", authMiddleware, deleteProductCategory);

Router.patch("/category/:id", authMiddleware, isAdmin, updateProductCategory);


module.exports = Router;