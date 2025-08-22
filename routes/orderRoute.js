import express from "express";
import Order from "../models/Order.js";
import verifyToken from "../middleware/verifyToken.js";
import User from "../models/User.js";
import { getMyOrders } from "../controllers/OrderController.js";

const router = express.Router();

// @route   POST /api/order
// @desc    Save order after Razorpay payment
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, address, cartItems, paymentId, orderId } = req.body;

    if (!name || !email || !phone || !address || !cartItems || !paymentId || !orderId) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newOrder = new Order({
      name,
      email,
      phone,
      address,
      cartItems,
      paymentId,
      orderId,
    });

    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error saving order:", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

//my order
// router.get("/myorders", verifyToken, async (req, res) => {
//   try {
//     // ✅ Get the user's email using the ID from req.user
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // ✅ Now fetch orders using the email
//     const orders = await Order.find({ email: user.email }).sort({ createdAt: -1 });

//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     console.error("Error fetching orders:", error.message);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

router.get("/myorders", verifyToken, getMyOrders);

export default router;
