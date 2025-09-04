import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import authRouter from "./Routes/authRoute.js";
import userRouter from "./Routes/userRoute.js";
import productRouter from "./Routes/productsRouter.js";
import historyRouter from "./Routes/historyRoute.js";
import liabilityRouter from "./Routes/LiabilityRoute.js";
import financialRouter from "./Routes/financialRoute.js";
import categoryRouter from "./Routes/categoryRoute.js";
import SalesRouter from "./Routes/salesRoute.js";

// Database
import { connectdb } from "./lib/connectDB.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Multer uploads folder must exist
import fs from "fs";
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? [process.env.FRONTEND_URL, "https://your-frontend-domain.vercel.app"] 
      : "http://localhost:5173",
    credentials: true,
  })
);

// Serve uploads statically
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/history", historyRouter);
app.use("/api/liability", liabilityRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/financial", financialRouter);
app.use("/api/sales", SalesRouter);

// Serve frontend in production
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "FRONTEND1", "dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "FRONTEND1", "dist", "index.html"));
  });
}

// Start server
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
  connectdb();
});
