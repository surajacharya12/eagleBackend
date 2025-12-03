const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToDatabase = require("./utils/mongo");

dotenv.config();

const app = express();

//MIDDLEWARE

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//CONNECT TO MONGO (with connection caching for serverless)
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  try {
    await connectToDatabase(process.env.MONGO_URL);
    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    throw err;
  }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Database connection error" });
  }
});

//ROUTES

app.use("/founder", require("./route/founder"));

//HOME ROUTE

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

//ERROR HANDLING

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
