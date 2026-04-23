import axios from "axios";

// In development, baseURL is empty so all /api requests go through Vite proxy → localhost:8000
// In production, VITE_API_BASE_URL must be set to the deployed backend URL
let baseURL = import.meta.env.VITE_API_BASE_URL || "";

if (
  typeof window !== "undefined" &&
  window.location.protocol === "https:" &&
  baseURL.startsWith("http://")
) {
  baseURL = baseURL.replace("http://", "https://");
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
