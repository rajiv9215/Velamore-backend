import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true }, // ✅ Correct
  size: { type: String}, // 👈 NEW FIELD
  quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema],
});

export default mongoose.model("Cart", cartSchema);
