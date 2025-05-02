const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../utils/email");
const { v4: uuidv4 } = require("uuid");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = uuidv4();
    const user = new User({
      email,
      password: hashedPassword, // Store the hashed password
      verificationToken,
    });

    await user.save();
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: "Registration successful. Check email for verification.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({
      error: error.message,
      details: error.errors
        ? Object.values(error.errors).map((e) => e.message)
        : null,
    });
  }
};

exports.login = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const user = req.user;
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("jwt", token, { httpOnly: true });
    res.json({
      token,
      user: { email: user.email, id: user._id, isVerified: user.isVerified },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.query.token });

    if (!user) {
      // Check if user is already verified
      const verifiedUser = await User.findOne({
        email: req.query.email,
        isVerified: true,
      });
      if (verifiedUser) {
        return res.json({ message: "Email already verified" });
      }
      return res.status(400).json({ error: "Invalid token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
