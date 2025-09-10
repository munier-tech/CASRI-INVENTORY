// src/store/productsStore.js
import { create } from "zustand";
import axios from "../lib/axios"; // ✅ your custom axios instance

const useProductsStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  // ✅ Fetch all products
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/products");
      set({ products: res.data, loading: false });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Failed to fetch products", 
        loading: false 
      });
    }
  },

  // ✅ Create product
  createProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post("/products", productData);
      set((state) => ({ products: [...state.products, res.data], loading: false }));
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Failed to create product", 
        loading: false 
      });
    }
  },

  // ✅ Update product
  updateProduct: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.put(`/products/${id}`, updatedData);
      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? res.data : product
        ),
        loading: false,
      }));
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Failed to update product", 
        loading: false 
      });
    }
  },

  // ✅ Delete product
  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/products/${id}`);
      set((state) => ({
        products: state.products.filter((product) => product._id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Failed to delete product", 
        loading: false 
      });
    }
  },
}));

export default useProductsStore;
