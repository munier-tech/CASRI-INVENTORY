import Category from "../models/categoryModel.js";

// ✅ Create Category
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    if (!name) return res.status(400).json({ error: "Name is required" });

    const category = new Category({ name, description, imageUrl });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined; // only update if new image uploaded

    const updatedFields = { name, description };
    if (imageUrl) updatedFields.imageUrl = imageUrl;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true, runValidators: true }
    );

    if (!category) return res.status(404).json({ error: "Category not found" });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Get All Categories
export const getCategories = async (_req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Single Category
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Category


// ✅ Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
