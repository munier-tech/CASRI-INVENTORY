// store/salesStore.js
import { create } from "zustand";
import axios from "../lib/axios"; // ✅ import shared axios instance

const useSalesStore = create((set) => ({
  sales: [],
  dailySales: [],
  usersDailySales: [],
  salesByDate: [],
  allUsersSalesByDate: [],
  todaySales: [],
  loading: false,
  error: null,
  total: 0,

  // -------------------- BASIC CRUD --------------------
  fetchSales: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/sales");
      set({ sales: res.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to fetch sales", loading: false });
    }
  },

  createSale: async (saleData) => {
    try {
      const res = await axios.post("/sales", saleData);
      set((state) => ({ sales: [...state.sales, res.data] }));
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to create sale" });
    }
  },

  updateSale: async (saleId, updatedData) => {
    try {
      const res = await axios.put(`/sales/${saleId}`, updatedData);
      set((state) => ({
        sales: state.sales.map((sale) => (sale._id === saleId ? res.data : sale)),
      }));
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to update sale" });
    }
  },

  deleteSale: async (saleId) => {
    try {
      await axios.delete(`/sales/${saleId}`);
      set((state) => ({
        sales: state.sales.filter((sale) => sale._id !== saleId),
      }));
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to delete sale" });
    }
  },

  // -------------------- DAILY & DATE-BASED --------------------
  fetchDailySales: async () => {
    try {
      const res = await axios.get("/sales/daily");
      set({ dailySales: res.data });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to fetch daily sales" });
    }
  },

  fetchUsersDailySales: async () => {
    try {
      const res = await axios.get("/sales/users/daily");
      set({ usersDailySales: res.data });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to fetch users daily sales" });
    }
  },

  fetchSalesByDate: async (date) => {
    try {
      const res = await axios.get(`/sales/date/${date}`);
      set({ salesByDate: res.data });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to fetch sales by date" });
    }
  },

  fetchAllUsersSalesByDate: async (date) => {
    try {
      const res = await axios.get(`/sales/all/date/${date}`);
      set({ allUsersSalesByDate: res.data });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to fetch all users sales by date" });
    }
  },

  fetchTodaySales: async () => {
    try {
      const res = await axios.get("/sales/today");
      set({ todaySales: res.data });
    } catch (err) {
      set({ error: err.response?.data?.error || "Failed to fetch today’s sales" });
    }
  },
}));

export default useSalesStore;
