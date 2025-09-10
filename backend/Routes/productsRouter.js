import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { createProduct, deleteProduct, getLowStockProducts, getProductById, getProducts, updateProduct } from "../Controllers/productsController.js";


const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/low-stock", getLowStockProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
