import express from 'express';
import Product from '../models/Product.js';
import verifyToken from '../middleware/verifyToken.js';
import Cart from "../models/Cart.js"; // ✅ Adjust path if needed


const router = express.Router();

router.post("/addproduct", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(200).json({ success: true, product });
  } catch (err) {
    console.error("Error saving product:", err);
    res.status(500).json({ success: false, message: "Product not saved", error: err.message });
  }
});

router.get("/allproducts", async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

router.get("/newcollections", async (req, res) => {
  const products = await Product.find({});
  res.send(products.slice(-8));
});

router.get("/popularinwomen", async (req, res) => {
  const products = await Product.find({ category: "women" });
  res.send(products.slice(0, 4));
});

router.post("/relatedproducts", async (req, res) => {
  const { category } = req.body;
  const products = await Product.find({ category });
  res.send(products.slice(0, 4));
});

// router.post("/addtocart", verifyToken, async (req, res) => {
//   console.log("hi")
//   console.log("Incoming addtocart body:", req.body);
//   try {
//     const userId = req.user.id;
//     const { itemId, size } = req.body;

//     if (!itemId || !size) {
//       return res.status(400).json({ success: false, message: "Item ID and size are required" });
//     }

//     let cart = await Cart.findOne({ userId });

//     if (!cart) {
//       // Create new cart for user
//       cart = new Cart({
//         userId,
//         items: [{ itemId, size, quantity: 1 }],
//       });
//     } else {
//       // Check if item with same size already exists
//       const existingItem = cart.items.find(
//         (item) => item.itemId === itemId && item.size === size
//       );

//       if (existingItem) {
//         existingItem.quantity += 1;
//       } else {
//         cart.items.push({ itemId, size, quantity: 1 });
//       }
//     }

//     await cart.save();
//     res.status(200).json({ success: true, message: "Item added to cart" });
//   } catch (error) {
//     console.error("Add to cart error:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });

router.delete("/delete/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // Delete images from Cloudinary
    for (const img of product.image) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await product.deleteOne();
    
    res.json({ success: true, message: "Product and images deleted" });
  } catch (err) {
    console.error("Deletion error:", err);
    res.status(500).json({ success: false, message: "Deletion failed" });
  }
});

// router.post('/removefromcart', verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { itemId, size } = req.body;

//     if (!itemId) {
//       return res.status(400).json({ success: false, message: "Missing itemId" });
//     }

//     const cart = await Cart.findOne({ userId });
//     if (!cart) {
//       return res.status(400).json({ success: false, message: "Cart not found" });
//     }

//     const itemIndex = cart.items.findIndex((item) => {
//   return item.itemId === itemId && (size ? item.size === size : true);
// });


//     if (itemIndex === -1) {
//       return res.status(400).json({ success: false, message: "Item not in cart" });
//     }

//     if (cart.items[itemIndex].quantity > 1) {
//       cart.items[itemIndex].quantity -= 1;
//     } else {
//       cart.items.splice(itemIndex, 1); // remove item
//     }

//     await cart.save();
//     res.status(200).json({ success: true });
//   } catch (err) {
//     console.error("removefromcart error:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });



export default router;