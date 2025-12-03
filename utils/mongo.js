// utils/mongo.js
const mongoose = require("mongoose");

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectToDatabase(uri) {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 3000, // Reduced from 5000ms to fail faster
        socketTimeoutMS: 45000,
        connectTimeoutMS: 3000, // Added to prevent hanging connections
      })
      .then((mongoose) => mongoose)
      .catch((err) => {
        cached.promise = null; // Reset promise on failure
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectToDatabase;
