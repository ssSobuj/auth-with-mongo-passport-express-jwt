const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log("✅ MongoDB connected via Mongoose");
  } catch (error) {
    console.error("🔴 MongoDB connection error:", error);
    throw error; // Re-throw to handle in server.js
  }
}

module.exports = { connectDB };
