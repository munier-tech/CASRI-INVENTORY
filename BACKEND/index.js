import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Multer uploads folder must exist
import fs from "fs";
import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import historyRouter from "./routes/historyRouter.js";
import liabilityRouter from "./routes/liabilityRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import financialRouter from "./routes/financialRouter.js";
import SalesRouter from "./routes/SalesRouter.js";
import connectdb from "./config/db.js";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? [
          process.env.CORS_ORIGIN, 
          process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
        ].filter(Boolean)
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

// Connect to database
connectdb();

// Export the Express app for Vercel
export default app;

// Start server for local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("Server running on port", PORT);
  });
}
