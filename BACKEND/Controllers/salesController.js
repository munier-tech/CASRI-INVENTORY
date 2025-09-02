import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import dayjs from "dayjs";

// Create Sale
export const createSale = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ error: "Not enough stock" });

    const sellingPrice = product.price; // fixed price at time of sale
    const total = sellingPrice * quantity;

    product.stock -= quantity;
    await product.save();

    const sale = new Sale({
      product: product._id,
      quantity,
      sellingPrice,
      total,
      user: req.user._id,
    });

    await sale.save();
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Sales
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("product", "name price").populate("user", "username role");
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Sale by ID
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate("product", "name");
    if (!sale) return res.status(404).json({ error: "Sale not found" });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================== DAILY / DATE FUNCTIONS BASED ON SALES ==================

// Get logged-in user's sales for today
export const getMyDailySales = async (req, res) => {
  try {
    const userId = req.user._id;
    const start = dayjs().startOf("day").toDate();
    const end = dayjs().endOf("day").toDate();

    const sales = await Sale.find({
      user: userId,
      createdAt: { $gte: start, $lte: end },
    }).populate("product", "name price");

    if (!sales.length) return res.status(404).json({ message: "No sales today" });

    const total = sales.reduce((sum, s) => sum + s.total, 0);
    res.status(200).json({ message: "Today's sales fetched", sales, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users' sales for today
export const getUsersDailySales = async (req, res) => {
  try {
    const start = dayjs().startOf("day").toDate();
    const end = dayjs().endOf("day").toDate();

    const users = await User.find({ role: { $in: ["employee", "admin"] } });

    const results = await Promise.all(
      users.map(async (user) => {
        const sales = await Sale.find({
          user: user._id,
          createdAt: { $gte: start, $lte: end },
        }).populate("product", "name price");

        return {
          username: user.username,
          role: user.role,
          sales,
          total: sales.reduce((sum, s) => sum + s.total, 0),
        };
      })
    );

    const filteredResults = results.filter(r => r.sales.length > 0);
    if (!filteredResults.length) return res.status(404).json({ message: "No sales today for any user" });

    res.status(200).json({ message: "Daily sales fetched", data: filteredResults });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sales by date
export const getSalesByDate = async (req, res) => {
  try {
    const { date } = req.params; // YYYY-MM-DD
    const start = dayjs(date).startOf("day").toDate();
    const end = dayjs(date).endOf("day").toDate();

    const sales = await Sale.find({
      createdAt: { $gte: start, $lte: end },
    }).populate("product", "name price").populate("user", "username role");

    if (!sales.length) return res.status(404).json({ message: `No sales found on ${date}` });

    const total = sales.reduce((sum, s) => sum + s.total, 0);
    res.status(200).json({ message: `Sales for ${date} fetched`, sales, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users' sales by date
export const getAllUsersSalesByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const start = dayjs(date).startOf("day").toDate();
    const end = dayjs(date).endOf("day").toDate();

    const users = await User.find({ role: { $in: ["employee", "admin"] } });

    const results = await Promise.all(
      users.map(async (user) => {
        const sales = await Sale.find({
          user: user._id,
          createdAt: { $gte: start, $lte: end },
        }).populate("product", "name price");

        return {
          username: user.username,
          role: user.role,
          sales,
          total: sales.reduce((sum, s) => sum + s.total, 0),
        };
      })
    );

    const filteredResults = results.filter(r => r.sales.length > 0);
    if (!filteredResults.length) return res.status(404).json({ message: `No sales found on ${date} for any user` });

    res.status(200).json({ message: `Sales for ${date} fetched`, data: filteredResults });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ------------------- UPDATE DAILY SALE -------------------
export const updateDailySale = async (req, res) => {
  try {
    const { saleId } = req.params;
    const { productId, quantity } = req.body;

    const sale = await Sale.findById(saleId);
    if (!sale) return res.status(404).json({ error: "Sale not found" });

    const oldProduct = await Product.findById(sale.product);
    if (!oldProduct) return res.status(404).json({ error: "Original product not found" });

    // Restore stock from old sale
    oldProduct.stock += sale.quantity;
    await oldProduct.save();

    // If product changed, get new product
    const newProduct = productId ? await Product.findById(productId) : oldProduct;
    if (!newProduct) return res.status(404).json({ error: "New product not found" });

    // Check stock availability for new quantity
    if (quantity > newProduct.stock) return res.status(400).json({ error: "Not enough stock for updated quantity" });

    // Update sale
    sale.product = newProduct._id;
    sale.quantity = quantity;
    sale.sellingPrice = newProduct.price; // fixed price at sale time
    sale.total = sale.sellingPrice * quantity;
    await sale.save();

    // Deduct stock from new product
    newProduct.stock -= quantity;
    await newProduct.save();

    res.status(200).json({ message: "Daily sale updated successfully", sale });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------- DELETE DAILY SALE -------------------
export const deleteDailySale = async (req, res) => {
  try {
    const { saleId } = req.params;

    const sale = await Sale.findById(saleId);
    if (!sale) return res.status(404).json({ error: "Sale not found" });

    const product = await Product.findById(sale.product);
    if (product) {
      // Return stock to inventory
      product.stock += sale.quantity;
      await product.save();
    }

    await Sale.findByIdAndDelete(saleId);
    res.status(200).json({ message: "Daily sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------- GET TODAY'S SALES -------------------
export const getDailySales = async (req, res) => {
  try {
    const start = dayjs().startOf("day").toDate();
    const end = dayjs().endOf("day").toDate();

    const sales = await Sale.find({ createdAt: { $gte: start, $lte: end } })
      .populate("product", "name price")
      .populate("user", "username");

    res.status(200).json({ sales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
