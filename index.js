import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import cartRoutes from './routes/cart.js';
import uploadRoutes from './routes/upload.js';
import cookieParser from 'cookie-parser';
import razorpayRoutes from "./routes/razorpay.js";
import orderRoute from "./routes/orderRoute.js";
import newsletterRoutes from './routes/newsletter.js';




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
const port = process.env.PORT || 4000;


app.use(cookieParser());
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin: ' + origin));
    }
  },
  credentials: true
}));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(port, () => {
      console.log("🚀 Server Running on port " + port);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
  });

app.use('/images', express.static(path.join(__dirname, 'upload/images')));

app.use('/', authRoutes);
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/', uploadRoutes);
app.use("/api/order", orderRoute);
app.use("/api/razorpay", razorpayRoutes);
app.use("/api/order", orderRoute);
app.use('/api/newsletter', newsletterRoutes);

app.get("/", (req, res) => {
  res.send("Root");
});



