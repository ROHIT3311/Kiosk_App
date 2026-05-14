require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   }),
// );

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/products", require("./routes/product.routes"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
