import Product from "../models/productModel.js";


// ✅ Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, cost, stock, lowStockThreshold, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !price || !cost || !category || !image) {
      return res.status(400).json({ error: "Name, price, cost, category, and image are required" });
    }

    const product = new Product({
      name,
      description,
      price,
      cost,
      image,
      category,
      stock: stock ?? 0,
      lowStockThreshold: lowStockThreshold ?? 5,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get All Products
export const getProducts = async (_req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, cost, stock, lowStockThreshold, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, cost, stock, lowStockThreshold, category, image },
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Get Low Stock Products
export const getLowStockProducts = async (_req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ["$stock", "$lowStockThreshold"] },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
