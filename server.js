const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose"); // Added for readyState check
const connectToDatabase = require("./utils/mongo");
const statsRouter = require("./route/stats");
const founderRouter = require("./route/founder");
const aboutRouter = require("./route/about");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Middleware to ensure database connection
app.use(async (req, res, next) => {
  // Check if MONGO_URL is set
  if (!process.env.MONGO_URL) {
    console.error("❌ MONGO_URL not set in environment variables");
    return res.status(500).json({
      success: false,
      message: "Database configuration error: MONGO_URL not set in environment variables",
    });
  }

  // Connect to database
  try {
    await connectToDatabase(process.env.MONGO_URL);
    next();
  } catch (error) {
    console.error("❌ Database connection failed in middleware:", error.message);
    // We continue even if DB fails, so that the root route (health check) might still work
    // or let individual routes fail when they try to access DB.
    // However, for strictness, we could error here. 
    // Let's attach the error to the request so routes can check it if they want.
    req.dbError = error;
    next();
  }
});

// Setup routes
app.use("/stats", statsRouter);
app.use("/founder", founderRouter);
app.use("/about", aboutRouter);

app.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.json({
    success: true,
    message: "Server is running...",
    database: statusMap[dbStatus] || "unknown",
    db_error: req.dbError ? req.dbError.message : null,
    env_check: {
      mongo_url_set: !!process.env.MONGO_URL,
      node_env: process.env.NODE_ENV,
    },
    endpoints: {
      stats: "/stats",
      founder: "/founder",
      about: "/about",
    },
  });
});

// Export app for Vercel (Serverless)
module.exports = app;

// Start server if running directly (Local Development)
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);

    if (process.env.MONGO_URL) {
      console.log(`📡 Attempting to connect to MongoDB...`);
      connectToDatabase(process.env.MONGO_URL)
        .then(() => console.log("✅ MongoDB Connected"))
        .catch(err => console.error("❌ MongoDB Connection Error:", err.message));
    } else {
      console.warn("⚠️ MONGO_URL not set, database features will fail");
    }
  });
}
