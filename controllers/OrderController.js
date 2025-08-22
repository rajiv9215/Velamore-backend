// controllers/orderController.js
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const getMyOrders = async (req, res) => {
  try {
    console.log("email",req.user.email)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Now fetch orders using the email
    const orders = await Order.find({ email: user.email }).sort({ createdAt: -1 });
      console.log("orders",orders)
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const enrichedCartItems = await Promise.all(
          Object.entries(order.cartItems).map(async ([key, quantity]) => {
            const [productId, variant] = key.split('_');
            const product = await Product.findById(productId).lean();
            if (!product) return null;

            return {
              _id: product._id,
              name: product.name,
              image: product.image?.[0] || "",
              variant,
              quantity,
            };
          })
        );

        return {
          ...order._doc,
          cartItems: enrichedCartItems.filter(Boolean),
        };
      })
    );

    res.json({ success: true, orders: enrichedOrders });
  } catch (error) {
    console.error("getMyOrders error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
