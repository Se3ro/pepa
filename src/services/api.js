import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api", // URL backendu
  headers: {
    "Content-Type": "application/json",
  },
});

export const getStatistics = () => API.get("/statistiky");
export const getProducts = () => API.get("/produkty");
export const getOrders = () => API.get("/objednavky");
export const getPromoCodes = () => API.get("/promokody");

export const createProduct = (product) => API.post("/produkty", product);
export const updateProduct = (id, product) => API.put(`/produkty/${id}`, product);
export const deleteProduct = (id) => API.delete(`/produkty/${id}`);

export const createPromoCode = (promoCode) => API.post("/promokody", promoCode);
export const updatePromoCode = (id, promoCode) => API.put(`/promokody/${id}`, promoCode);
export const deletePromoCode = (id) => API.delete(`/promokody/${id}`);
