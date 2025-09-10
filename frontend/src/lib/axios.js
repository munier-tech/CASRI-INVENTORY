import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL || (import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api"),
  withCredentials: true,
});

export default axiosInstance;