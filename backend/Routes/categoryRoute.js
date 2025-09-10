import express from "express";
import {
  createCategory,
  updateCategory,
  getCategories,
  getCategoryById,
  deleteCategory
} from "../Controllers/categoryController.js";

import upload  from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", createCategory);
router.put("/:id", updateCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.delete("/:id", deleteCategory);

export default router;
