import express from "express";
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../Controllers/categoryController.js";


const router = express.Router();

// CRUD Routes
router.post("/", createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
