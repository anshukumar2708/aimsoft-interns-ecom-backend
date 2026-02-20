const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send(`<h1>Hello World</h1>`);
});

app.use("/auth", authRoutes);
app.use("/", uploadRoutes);



module.exports = app;