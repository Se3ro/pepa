// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import ProductDetail from "./components/ProductDetail";
import Confirmation from "./components/Confirmation";
import Dashboard from "./Admin/Dashboard";
import Products from "./components/Products";
import AuthForm from "./components/AuthForm.js";  // Ujisti se, že cesta k souboru je správná

import axios from "axios";
import { HelmetProvider } from "react-helmet-async";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

const App = () => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = () => {
    axios
      .get("http://localhost:8080/api/kosik")
      .then((response) => {
        const items = response.data;
        const count = items.reduce((acc, item) => acc + item.mnozstvi, 0);
        setCartCount(count);
      })
      .catch((error) => console.error("Error fetching cart count:", error));
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <Navbar cartCount={cartCount} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductList />} />
            <Route
              path="/cart"
              element={<Cart refreshCart={fetchCartCount} />}
            />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/potvrzeni" element={<Confirmation />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/produkty" element={<Products />} />
            <Route path="/login" element={<AuthForm />} />  {/* Opravená cesta */}
          </Routes>
        </div>

        {/* Footer Component */}
      </Router>
    </HelmetProvider>
  );
};

export default App;
