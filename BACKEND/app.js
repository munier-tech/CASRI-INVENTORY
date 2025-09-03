import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";

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

// Ensure uploads directory exists (best-effort; not persistent on serverless)
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  try { fs.mkdirSync(uploadsDir); } catch {}
}

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// Static uploads
app.use("/uploads", express.static(uploadsDir));

// API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/history", historyRouter);
app.use("/api/liability", liabilityRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/financial", financialRouter);
app.use("/api/sales", SalesRouter);

// Connect DB on cold start
connectdb();

export default app;


