import axios from "axios";

const apiUrl = "http://127.0.0.1:8000"; // Fallback URL for Django backend

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

export default api;
