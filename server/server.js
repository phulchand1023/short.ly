require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");

const urlRoutes = require("./routes/url");
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const linksRoutes = require("./routes/links");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running fine!");
});

app.use("/api", urlRoutes);
app.use("/", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", linksRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
