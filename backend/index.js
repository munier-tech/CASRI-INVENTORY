import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import authRouter from "./Routes/authRoute.js";
import userRouter from "./Routes/userRoute.js";
import productRouter from "./Routes/productsRouter.js";
import historyRouter from "./Routes/historyRoute.js";
import liabilityRouter from "./Routes/LiabilityRoute.js";
import financialRouter from "./Routes/financialRoute.js";
import categoryRouter from "./Routes/categoryRoute.js";
import SalesRouter from "./Routes/salesRoute.js";
import uploadRouter from "./Routes/uploadRoute.js";
import { connectdb } from "./lib/connectDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? [
          process.env.CORS_ORIGIN, 
          process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
          "https://casri-inventoryyjy-nceq4p6ij-98hgilus-projects.vercel.app"
        ].filter(Boolean)
      : "http://localhost:5173",
    credentials: true,
  })
);

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Middleware to ensure database connection before any DB operation
app.use(async (req, res, next) => {
  try {
    // Only connect for API routes that need database
    if (req.path.startsWith('/api/') && !req.path.includes('test-simple')) {
      await connectdb();
    }
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ 
      success: false, 
      error: "Database connection failed",
      details: error.message 
    });
  }
});

// Serve uploads statically
app.use("/uploads", express.static(uploadsDir));

// API test endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'CASRI Inventory Management System API is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongoConnected: mongoose.connection.readyState === 1,
    envVars: {
      hasMongoUrl: !!process.env.MONGO_DB_URL,
      hasRedisUrl: !!process.env.REDIS_UPSTASH_URL,
      hasTokenSecret: !!process.env.TOKEN_SECRET_KEY,
      hasRefreshTokenSecret: !!process.env.REFRESH_TOKEN_SECRET_KEY,
      corsOrigin: process.env.CORS_ORIGIN,
      vercelUrl: process.env.VERCEL_URL
    },
    cors: {
      allowedOrigins: process.env.NODE_ENV === "production" 
        ? [process.env.CORS_ORIGIN, process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null].filter(Boolean)
        : "http://localhost:5173",
      credentials: true
    }
  });
});

// Quick test endpoint for database
app.get('/api/test-db', async (req, res) => {
  try {
    await connectdb();
    res.json({ success: true, message: 'Database connection successful' });
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Debug endpoint to check users in database
app.get('/api/debug/users', async (req, res) => {
  try {
    await connectdb();
    const User = (await import('./models/userModel.js')).default;
    const users = await User.find({}, 'email username role createdAt');
    res.json({ 
      success: true, 
      userCount: users.length,
      users: users 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Simple test endpoint that always works
app.get('/api/test-simple', (req, res) => {
  res.json({
    success: true,
    message: "Simple test endpoint working!",
    timestamp: new Date().toISOString(),
    headers: req.headers,
    query: req.query
  });
});

// Create test user endpoint
app.post('/api/create-test-user', async (req, res) => {
  try {
    await connectdb();
    const User = (await import('./models/userModel.js')).default;
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'admin@test.com' });
    if (existingUser) {
      return res.json({
        success: true,
        message: "Test user already exists",
        credentials: {
          email: "admin@test.com",
          password: "admin123"
        }
      });
    }

    // Create test user
    const testUser = await User.create({
      username: 'admin',
      email: 'admin@test.com',
      password: 'admin123'
    });

    res.json({
      success: true,
      message: "Test user created successfully",
      credentials: {
        email: "admin@test.com",
        password: "admin123"
      },
      user: {
        id: testUser._id,
        username: testUser.username,
        email: testUser.email
      }
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// Temporary: Allow products and categories without auth for testing
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/upload", uploadRouter);

// Protected routes (require auth)
app.use("/api/history", historyRouter);
app.use("/api/liability", liabilityRouter);
app.use("/api/financial", financialRouter);
app.use("/api/sales", SalesRouter);

// Serve frontend in production
// Serve frontend in production
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));  // ✅ changed FRONTEND1 → frontend

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html")); // ✅ changed FRONTEND1 → frontend
  });
}

// Connect to database immediately when server starts
connectdb().then(() => {
  console.log("Connected to MongoDB successfully");
}).catch(err => {
  console.error("Failed to connect to MongoDB:", err);
});

// Export the Express app for Vercel
export default app;

// Start server for local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS Origin: ${process.env.NODE_ENV === "production" ? process.env.CORS_ORIGIN : "http://localhost:5173"}`);
  });
}
