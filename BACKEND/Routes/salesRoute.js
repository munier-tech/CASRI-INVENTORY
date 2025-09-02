import express from "express";
import {
  createSale,
  getSales,
  getSaleById,
  getMyDailySales,
  getUsersDailySales,
  getSalesByDate,
  getAllUsersSalesByDate,
  updateDailySale,
  deleteDailySale,
  getDailySales,
} from "../Controllers/salesController.js";
import { protectedRoute, adminRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ------------------- CRUD -------------------
router.post("/", protectedRoute, createSale); // Create a sale
router.get("/", protectedRoute, getSales); // Get all sales
router.get("/:id", protectedRoute, getSaleById); // Get sale by ID

// ------------------- Daily Sales -------------------
router.get("/daily/me", protectedRoute, getMyDailySales); // Logged-in user's daily sales
router.get("/daily/users", protectedRoute, adminRoute, getUsersDailySales); // All users daily sales
router.get("/daily", protectedRoute, adminRoute, getDailySales); // All sales today

// ------------------- Sales by Date -------------------
router.get("/date/:date", protectedRoute, getSalesByDate); // Sales by date
router.get("/date/:date/users", protectedRoute, adminRoute, getAllUsersSalesByDate); // All users sales by date

// ------------------- Admin Daily Sale Management -------------------
router.patch("/daily/:saleId", protectedRoute, adminRoute, updateDailySale); // Update daily sale
router.delete("/daily/:saleId", protectedRoute, adminRoute, deleteDailySale); // Delete daily sale

export default router;
