require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const app = express();

const PORT = process.env.PORT || 5000;

connectDB();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running fine!");
});

const urlRoutes = require("./routes/url");
app.use("/api", urlRoutes);

const indexRoutes = require("./routes/index");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const linksRoutes = require("./routes/links");
app.use("/api", linksRoutes);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
