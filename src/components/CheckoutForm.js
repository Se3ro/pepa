import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ onPaymentSubmit }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const {token, error} = await stripe.createToken(cardElement);

    if (error) {
      console.error(error);
      alert('Chyba při zpracování karty');
    } else {
      onPaymentSubmit(token); // Odeslání tokenu do backendu pro zpracování platby
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="card-element">Platební karta</label>
        <CardElement id="card-element" />
      </div>
      <button type="submit" disabled={!stripe}>
        Zaplatit
      </button>
    </form>
  );
};

export default CheckoutForm;
