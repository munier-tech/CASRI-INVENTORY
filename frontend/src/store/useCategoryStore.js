// store/categoryStore.js
import { create } from "zustand";
import axios from "../lib/axios"; // your custom Axios instance

const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  // -------------------- FETCH --------------------
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/categories");
      // ensure categories is always an array
      set({ categories: Array.isArray(res.data) ? res.data : [], loading: false });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Failed to fetch categories", 
        categories: [], // safety
        loading: false 
      });
    }
  },

  // -------------------- CREATE --------------------
  createCategory: async (categoryData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/categories", categoryData);
      set((state) => ({ categories: [...state.categories, res.data], loading: false }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to create category", loading: false });
    }
  },

  // -------------------- UPDATE --------------------
  updateCategory: async (categoryId, updatedData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/categories/${categoryId}`, updatedData);
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat._id === categoryId ? res.data : cat
        ),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to update category", loading: false });
    }
  },

  // -------------------- DELETE --------------------
  deleteCategory: async (categoryId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/categories/${categoryId}`);
      set((state) => ({
        categories: state.categories.filter((cat) => cat._id !== categoryId),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to delete category", loading: false });
    }
  },
}));

export default useCategoryStore;
