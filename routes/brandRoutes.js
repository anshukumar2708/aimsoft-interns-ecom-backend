const express = require("express");
const { addBrand, getBrands, updateBrand, deleteBrand } = require("../controllers/product/brandController");
const { isAdmin, authMiddleware } = require("../middleware/authMiddleware");


const Router = express.Router();


Router.post("/add", authMiddleware, isAdmin, addBrand);
Router.get("/list", getBrands);
Router.patch("/update/:id", authMiddleware, isAdmin, updateBrand);
Router.delete("/delete/:id", authMiddleware, isAdmin, deleteBrand);


module.exports = Router;