import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaUserAlt, FaPhoneAlt, FaEnvelope, FaDollarSign } from 'react-icons/fa';
import './Confirmation.css'; // Importování stylu

const Confirmation = () => {
  const location = useLocation();
  const { orderDetails } = location.state || {};

  if (!orderDetails) return <p>Chyba, objednávka nebyla nalezena.</p>;

  return (
    <div className="confirmation">
      <h2>Potvrzení objednávky</h2>
      <p>Děkujeme za vaši objednávku!</p>
      <h3>Podrobnosti objednávky</h3>
      <ul className="confirmation-details">
        <li>
          <FaUserAlt className="icon" />
          <p>Jméno: <span>{orderDetails.jmeno} {orderDetails.prijmeni}</span></p>
        </li>
        <li>
          <FaEnvelope className="icon" />
          <p>Email: <span>{orderDetails.email}</span></p>
        </li>
        <li>
          <FaPhoneAlt className="icon" />
          <p>Telefon: <span>{orderDetails.telefon}</span></p>
        </li>
        <li>
          <FaDollarSign className="icon" />
          <p>Celková cena: <span>{orderDetails.celkovaCena} Kč</span></p>
        </li>
      </ul>
    </div>
  );
};

export default Confirmation;
