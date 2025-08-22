import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  ],
  category: { type: String, required: true },
  new_price: Number,
  old_price: Number,
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

export default mongoose.model("Product", productSchema);
