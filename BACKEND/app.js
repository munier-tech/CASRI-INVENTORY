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

const PORT = process.env.PORT || 5000;

// Configure CORS for different environments
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CORS_ORIGIN, "https://casri-inventory.vercel.app"] 
    : 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Ensure uploads directory exists (best-effort; not persistent on serverless)
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  try { fs.mkdirSync(uploadsDir); } catch {}
}

// Static uploads
app.use("/uploads", express.static(uploadsDir));

// API test endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'CASRI Inventory Management System API is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    cors: {
      allowedOrigins: Array.isArray(corsOptions.origin) 
        ? corsOptions.origin.join(', ') 
        : corsOptions.origin,
      credentials: corsOptions.credentials
    }
  });
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/history", historyRouter);
app.use("/api/liability", liabilityRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/financial", financialRouter);
app.use("/api/sales", SalesRouter);

// Connect to database immediately
connectdb().then(() => {
  console.log("Connected to MongoDB successfully");
}).catch(err => {
  console.error("Failed to connect to MongoDB:", err);
});

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
}

// Export app for Vercel serverless
export default app;


