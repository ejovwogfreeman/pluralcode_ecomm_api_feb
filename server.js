const express = require("express");

// load env
require("dotenv").config();
// const morgan = require("morgan");
const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const port = process.env.PORT || 5000;

// connect to MongoDB
connectDB();

// initialize express
const app = express();

// middlewares

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// logger middleware
// app.use(morgan("dev"));
app.use(logger);

// test route for api
app.get("/api", (req, res) =>
  res.json({ msg: "welcome to our ecommerce api" })
);

// product routes
app.use("/api/products", require("./routes/productRoutes"));

// running my server
app.listen(port, () =>
  console.log(`server running on http://localhost:${port}`)
);
