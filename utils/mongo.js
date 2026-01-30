const mongoose = require("mongoose");

async function connectToDatabase(uri) {
  if (!uri) throw new Error("MONGO_URL is missing!");

  // 1 = connected, 2 = connecting
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (mongoose.connection.readyState === 2) {
    console.log("⏳ DB already connecting, waiting...");
    return mongoose.connection;
  }

  try {
    console.log("🔌 New DB connection attempt...");
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    console.log("✅ MongoDB connected");
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
}

module.exports = connectToDatabase;

