import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  const token = req.header("auth-token");
  // console.log("Received token:", token); // Debug: Log the token
  if (!token) {
    console.log("No token provided");
    return res
      .status(400)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log( "verifird",verified)
    req.user = {
      id: verified.user.id,
    };
    next();
  } catch (error) {
    console.error("JWT verification error:", error.name, error.message); // Debug: Log error details
    return res.status(400).json({ success: false, message: "Invalid Token" });
  }
};

export default verifyToken;
