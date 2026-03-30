const mongoose = require("mongoose");

const ProductSubCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters"],
        unique: true
    },
    slug: {
        type: String,
        required: [true, "slug is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters"],
        unique: true
    },
    image: {
        type: String,
        // required: [true, "Image is required"],
        trim: true,
    },
    description: {
        type: String,
        trim: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductCategory",
        required: [true, "Category is required"]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    displayOrder: {
        type: Number,
        default: null
    }
},
    { timestamps: true }
)

module.exports = mongoose.model("SubCategory", ProductSubCategorySchema)