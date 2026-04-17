const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const s3Routes = require("./routes/s3Routes");

// Product
const productRoutes = require("./routes/productRoutes");
const brandRoutes = require("./routes/brandRoutes")
const colorRoutes = require("./routes/colorRoutes")


dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send(`<h1>Hello World</h1>`);
});

// Auth Routes
app.use("/auth", authRoutes);

// S3 routes
app.use("/", s3Routes);

// product
app.use("/product", productRoutes);

// brand
app.use("/brand", brandRoutes);

// color
app.use("/color", colorRoutes);


module.exports = app;