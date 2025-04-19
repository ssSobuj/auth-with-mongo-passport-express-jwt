require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 5000;
const authRoutes = require("./routes/authRoutes");

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(cookieParser());

// Initialize passport
require("./config/passport");
app.use(passport.initialize());
// Async function to initialize server
async function initializeServer() {
  try {
    // Connect to DB first
    await connectDB();
    console.log("Database connected successfully");

    // Set up routes after DB connection

    app.get("/api", (req, res) => {
      res.send("Simple E-commerce Server Running!");
    });

    app.use("/api/auth", authRoutes);

    // Error handling
    app.use(errorHandler);

    // Start server only locally
    if (!process.env.VERCEL) {
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    }
  } catch (error) {
    console.error("Server initialization failed:", error);
    process.exit(1);
  }
}

initializeServer();

module.exports = app;
