// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectToDatabase = require("./utils/mongo");

const statsRouter = require("./route/stats");
const founderRouter = require("./route/founder");
const aboutRouter = require("./route/about");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));


// CONNECT DATABASE ON SERVER START ONLY

// Middleware to ensure database connection
app.use(async (req, res, next) => {
  if (!process.env.MONGO_URL) {
    return res.status(500).json({ message: "MONGO_URL not set" });
  }
  try {
    await connectToDatabase(process.env.MONGO_URL);
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ message: "Database connection failed", error: error.message });
  }
});


// ROUTES

app.use("/stats", statsRouter);
app.use("/founder", founderRouter);
app.use("/about", aboutRouter);

app.get("/", (req, res) => {
  const readyState = mongoose.connection.readyState;

  const statusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.json({
    success: true,
    message: "Server is running...",
    database: statusMap[readyState],
    env_check: {
      MONGO_URL_set: !!process.env.MONGO_URL,
      NODE_ENV: process.env.NODE_ENV || "development",
    },
    endpoints: {
      stats: "/stats",
      founder: "/founder",
      about: "/about",
    },
  });
});


module.exports = app;


if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
