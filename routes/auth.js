import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Users from "../models/User.js";

const router = express.Router();

// 🔑 Helper to create JWT
const generateToken = (userId) => {
  return jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// 🧪 (Optional) basic email/password validation
const isValidInput = (email, password) => {
  return (
    typeof email === "string" &&
    typeof password === "string" &&
    email.includes("@") &&
    password.length >= 6
  );
};

// 🚪 POST /login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let success = false;

  if (!isValidInput(email, password)) {
    return res
      .status(400)
      .json({ success, message: "Invalid email or password format" });
  }

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success, message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    success = true;
    return res.json({ success, token });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    return res.status(500).json({ success, message: "Internal server error" });
  }
});

// 🧾 POST /signup
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  let success = false;

  if (!isValidInput(email, password)) {
    return res
      .status(400)
      .json({ success, message: "Invalid email or password format" });
  }

  try {
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success, message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new Users({
      name: username,
      email,
      password: hashedPassword,
      cartData: {}, // ✅ start empty
    });

    await user.save();

    const token = generateToken(user._id);
    success = true;
    return res.json({ success, token });
  } catch (err) {
    console.error("❌ Signup error:", err.message);
    return res.status(500).json({ success, message: "Internal server error" });
  }
});

export default router;
