import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Načtení produktů
    axios.get('http://localhost:8080/api/produkty')
      .then(response => {
        setProducts(response.data);
        // Získání unikátních kategorií z produktů
        const uniqueCategories = [...new Set(response.data.map(product => product.kategorie))];
        setCategories(uniqueCategories);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError('Nepodařilo se načíst produkty.');
      });
  }, []);

  // Filtr podle kategorie
  const filteredProducts = selectedCategory
    ? products.filter(product => product.kategorie === selectedCategory)
    : products;

  return (
    <div className="product-list-container">
      {error && <p className="product-list-error">{error}</p>}
      
      {/* Výpis kategorií */}
      <div className="category-list">
        <button
          className={`category-item ${selectedCategory === '' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('')}
        >
          Všechny
        </button>
        {categories.map((category, index) => (
          <button
            key={index}
            className={`category-item ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="product-list-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-list-card">
              <img src={product.obrazek} alt={product.nazev} className="product-list-image" />
              <div className="product-list-info">
                <h3>{product.nazev}</h3>
                <p>{product.popis}</p>
                <p className="product-list-price">{product.cena} Kč</p>
                <p className="product-list-category"><strong>Kategorie:</strong> {product.kategorie}</p>
                <Link to={`/product/${product.id}`} className="product-list-detail-link">Detail</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Žádné produkty v této kategorii.</p>
      )}
    </div>
  );
}

export default ProductList;
