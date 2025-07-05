const express = require("express");

// load env
require("dotenv").config();
// const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const port = process.env.PORT || 5000;

// connect to MongoDB
connectDB();

// initialize express
const app = express();

// enable access by usign cors
app.use(cors());

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
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// running my server
app.listen(port, () =>
  console.log(`server running on http://localhost:${port}`)
);
