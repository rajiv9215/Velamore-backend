import express from 'express';
import Users from '../models/User.js';
import fetchuser from '../middleware/fetchuser.js';
import verifyToken from '../middleware/verifyToken.js';
import Cart from '../models/Cart.js';

const router = express.Router();

// router.post('/addtocart', verifyToken, async (req, res) => {
//   const userData = await Users.findById(req.user.id);
//   userData.cartData[req.body.itemId] += 1;
//   await Users.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });
//   res.send("Added");
// });

// router.post('/removefromcart', verifyToken, async (req, res) => {
//   const userData = await Users.findById(req.user.id);
//   if (userData.cartData[req.body.itemId] > 0) {
//     userData.cartData[req.body.itemId] -= 1;
//   }
//   await Users.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });
//   res.send("Removed");
// });
router.post('/removefromcart', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, size } = req.body;

    if (!itemId) {
      return res.status(400).json({ success: false, message: "Missing itemId" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(400).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) => {
  return item.itemId === itemId && (size ? item.size === size : true);
});


    if (itemIndex === -1) {
      return res.status(400).json({ success: false, message: "Item not in cart" });
    }

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1); // remove item
    }

    await cart.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("removefromcart error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/addtocart", verifyToken, async (req, res) => {
  console.log("hi")
  console.log("Incoming addtocart body:", req.body);
  try {
    const userId = req.user.id;
    const { itemId, size } = req.body;

    if (!itemId || !size) {
      return res.status(400).json({ success: false, message: "Item ID and size are required" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart for user
      cart = new Cart({
        userId,
        items: [{ itemId, size, quantity: 1 }],
      });
    } else {
      // Check if item with same size already exists
      const existingItem = cart.items.find(
        (item) => item.itemId === itemId && item.size === size
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ itemId, size, quantity: 1 });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/getcart", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    console.log(cart)

    if (!cart) {
      return res.status(200).json({ success: true, cart: { items: [] } });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}
);


export default router;
