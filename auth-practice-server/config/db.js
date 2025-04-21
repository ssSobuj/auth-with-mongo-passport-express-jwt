const mongoose = require("mongoose");

// Cache the connection to prevent cold start issues
let cachedDb = null;

async function connectDB() {
  if (cachedDb) {
    console.log("Using cached database connection");
    return cachedDb;
  }

  try {
    // Add additional connection options
    const options = {
      dbName: process.env.DB_NAME,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: "majority",
    };

    await mongoose.connect(process.env.MONGO_URI, options);

    // Cache the connection
    cachedDb = mongoose.connection;

    // Event listeners for connection
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected via Mongoose");
    });

    mongoose.connection.on("error", (err) => {
      console.error("🔴 MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("🟡 MongoDB disconnected");
    });

    return cachedDb;
  } catch (error) {
    console.error("🔴 MongoDB connection error:", error);
    throw error;
  }
}

module.exports = { connectDB };
