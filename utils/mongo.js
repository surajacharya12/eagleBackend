// utils/mongo.js
const mongoose = require("mongoose");

let isConnected = false;

async function connectToDatabase(uri) {
  if (!uri) throw new Error("MONGO_URL is missing!");

  // Already connected? return.
  if (isConnected) return mongoose.connection;

  try {
    const conn = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
}

module.exports = connectToDatabase;
