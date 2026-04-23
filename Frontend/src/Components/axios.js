import axios from "axios";

let baseURL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
