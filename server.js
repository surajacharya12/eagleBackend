// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToDatabase = require("./utils/mongo");

// Load environment variables
dotenv.config();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// --- MongoDB connection caching ---
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    if (!process.env.MONGO_URL) throw new Error("MONGO_URL not set");
    await connectToDatabase(process.env.MONGO_URL);
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    throw err;
  }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// --- Routes ---
app.use("/founder", require("./route/founder"));

// --- Home route ---
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running...",
    endpoints: {
      founder: "/founder",
      createFounder: "/founder/create",
      updateFounder: "/founder/update/:id",
      deleteFounder: "/founder/delete/:id",
    },
  });
});

// --- Health check route ---
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "Server is running",
    environment: process.env.NODE_ENV || "development",
    dbConnected: isConnected,
    timestamp: new Date().toISOString(),
  });
});

// --- Error handling ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// --- Local development ---
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// --- Export for Vercel ---
module.exports = app;
