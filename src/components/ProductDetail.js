import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import styles from '../styles/ProductDetail.module.css'; // Import CSS modul

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/produkty/${id}`)
      .then((response) => {
        setProduct(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
        setError('Nepodařilo se načíst detaily produktu.');
        setIsLoading(false);
      });
  }, [id]);

  const handleAddToCart = (productId) => {
    axios
      .post('http://localhost:8080/api/kosik/pridat', null, {
        params: {
          productId: productId,
          quantity: 1,
        },
      })
      .then((response) => {
        console.log('Produkt přidán do košíku', response.data);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      })
      .catch((error) => {
        console.error('Error adding product to cart:', error);
      });
  };

  return (
    <motion.div
      className={styles.productDetail}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
        />
      )}

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Načítání produktu...</p>
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <motion.div className={styles.productDetailCard}>
          <div className={styles.productDetailImageContainer}>
            <img
              src={product.obrazek}
              alt={product.nazev}
              className={styles.productDetailImage}
            />
          </div>
          <div className={styles.productDetailInfo}>
            <h1 className={styles.productDetailTitle}>{product.nazev}</h1>
            <p className={styles.productDetailDescription}>{product.popis}</p>
            <p className={styles.productDetailPrice}>
              <strong>Cena:</strong> {product.cena} Kč
            </p>
            <p className={styles.productDetailCategory}>
              <strong>Kategorie:</strong> {product.kategorie}
            </p>
            <p className={styles.productDetailIngredients}>
              <strong>Složení:</strong> {product.slozeni}
            </p>
            <button
              onClick={() => handleAddToCart(product.id)}
              className={styles.productDetailAddToCartBtn}
            >
              Přidat do košíku
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductDetail;
