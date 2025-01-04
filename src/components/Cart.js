import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Cart.css';
import { FaTrashAlt } from 'react-icons/fa';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const Cart = ({ refreshCart }) => {
  const [cartItems, setCartItems] = useState([]);
  const [promoKod, setPromoKod] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [promoUsed, setPromoUsed] = useState(false);
  const [originalPrice, setOriginalPrice] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (promoUsed) {
      reapplyPromoKod();
    }
  }, [cartItems]); // Při změně košíku znovu použije promo kód

  const fetchCart = () => {
    axios
      .get('http://localhost:8080/api/kosik')
      .then((response) => {
        const items = response.data;
        const price = items.reduce((acc, item) => acc + item.celkovaCena, 0);
        setCartItems(items);
        setTotalPrice(price);
        setOriginalPrice(price);

        if (items.some(item => item.sleva && item.sleva > 0)) {
          setPromoUsed(true);
        }
      })
      .catch((error) => console.error('Error fetching cart items:', error));
  };

  const handleRemoveItem = (itemId) => {
    axios
      .delete(`http://localhost:8080/api/kosik/${itemId}`)
      .then(() => {
        fetchCart();
        refreshCart();
      })
      .catch((error) => console.error('Error removing item:', error));
  };

  const handleApplyPromoKod = () => {
    if (promoUsed) return;
    axios
      .post(`http://localhost:8080/api/kosik/apply-promo?promoKod=${promoKod}`)
      .then((response) => {
        setTotalPrice(response.data);
        setPromoUsed(true);
        fetchCart();
      })
      .catch((error) => console.error('Error applying promo code:', error));
  };

  const reapplyPromoKod = () => {
    axios
      .post(`http://localhost:8080/api/kosik/apply-promo?promoKod=${promoKod}`)
      .then((response) => {
        setTotalPrice(response.data);
        fetchCart(); // Znovu načti košík, aby byla data konzistentní
      })
      .catch((error) => console.error('Error reapplying promo code:', error));
  };

  return (
    <div className="cart-container">
      <h2>Košík</h2>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>
            Košík je prázdný. <Link to="/products">Podívejte se na naše produkty!</Link>
          </p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.produkt.obrazek} alt={item.produkt.nazev} className="cart-item-image" />
              <div className="cart-item-details">
                <h4>{item.produkt.nazev}</h4>
                <p>
                  {promoUsed && item.sleva ? (
                    <>
                      <span className="old-price">{item.celkovaCena + item.sleva} Kč</span>{' '}
                      <span className="new-price">{item.celkovaCena} Kč</span>
                    </>
                  ) : (
                    `${item.celkovaCena} Kč`
                  )}
                </p>
                <p>Množství: {item.mnozstvi}</p>
                <button
                  className="remove-item-button"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <FaTrashAlt /> Odstranit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="cart-summary">
        <h3>
          Celková cena:{' '}
          {promoUsed ? (
            <>
              <span className="old-price">{originalPrice} Kč</span>{' '}
              <span className="new-price">{totalPrice} Kč</span>
            </>
          ) : (
            `${totalPrice} Kč`
          )}
        </h3>
        {!promoUsed && (
          <div className="promo-section">
            <input
              type="text"
              value={promoKod}
              onChange={(e) => setPromoKod(e.target.value)}
              placeholder="Zadejte promo kód"
              className="promo-input"
            />
            <button onClick={handleApplyPromoKod} className="apply-promo-button">
              Použít promo kód
            </button>
          </div>
        )}
        {promoUsed && (
          <p className="promo-success">
            <AiOutlineCheckCircle /> Promo kód byl úspěšně aplikován!
          </p>
        )}
        <Link to="/checkout">
          <button className="checkout-button">Pokračovat k pokladně</button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
