import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./Checkout.css";

const stripePromise = loadStripe("pk_test_51QdLnEQhNdqYBFMq2BNvZuVbahLbVQ290JM6u2W9AaG4FkWRK7xaqLFII3ONRMc3BY3kGZtIo1y9zLVsLK9ovsG600ILEZTVh9");

const CheckoutForm = ({ order, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setError("");

    try {
      const cardElement = elements.getElement(CardElement);

      const { token, error: stripeError } = await stripe.createToken(cardElement);
      if (stripeError) {
        setError(stripeError.message);
        setIsLoading(false);
        return;
      }

      await axios.post("http://localhost:8080/api/objednavky", {
        ...order,
        platbaToken: token.id,
        amount: order.celkovaCena * 100,
      });

      onPaymentSuccess();
      alert("Platba proběhla úspěšně!");
    } catch (err) {
      setError("Platba se nezdařila. Zkuste to prosím znovu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {order.zpusobPlatby === "karta" && (
        <form onSubmit={handleSubmit} className="checkout-form">
          <h3>Platba</h3>
          {error && <p className="error">{error}</p>}
          <CardElement options={{ hidePostalCode: true }} />
          <motion.button
            type="submit"
            disabled={isLoading || !stripe}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="submit-btn"
          >
            {isLoading ? "Zpracovávám..." : "Zaplatit"}
          </motion.button>
        </form>
      )}
    </>
  );
};

const Checkout = () => {
  const [order, setOrder] = useState({
    jmeno: "",
    prijmeni: "",
    email: "",
    telefon: "",
    ulice: "",
    mesto: "",
    zeme: "",
    psc: "",
    zpusobDopravy: "",
    zpusobPlatby: "",
    polozky: [],
    celkovaCena: 0,
    adresa: "", // Celá adresa
  });
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [step, setStep] = useState(1);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({ ...prevOrder, [name]: value }));
  };

  const handlePaymentSuccess = () => {
    axios.delete("http://localhost:8080/api/kosik/vymazat").catch(console.error);
    setIsPaymentComplete(true);
    navigate("/potvrzeni", { state: { orderDetails: order } });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/kosik")
      .then((response) => {
        const polozky = response.data;
        const celkovaCena = polozky.reduce((acc, item) => acc + item.celkovaCena, 0);
        setOrder((prevOrder) => ({ ...prevOrder, polozky, celkovaCena }));
      })
      .catch((err) => console.error("Chyba při načítání košíku:", err));
  }, []);

  const nextStep = (e) => {
    e.preventDefault();
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = (e) => {
    e.preventDefault();
    setStep((prevStep) => prevStep - 1);
  };

  // Funkce pro vyhledávání adresy
  const handleAddressSearch = async (query) => {
    if (query.length > 3) {
      try {
        const { data } = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=3bf050a14bbe441397243e93080757cf`
        );
        setAddressSuggestions(data.results);
      } catch (error) {
        console.error("Chyba při načítání návrhů adres:", error);
        setError("Nepodařilo se načíst návrhy adres.");
      }
    }
  };

  // Funkce pro rozdělení adresy do jednotlivých částí
  const parseAndFillAddress = (suggestion) => {
    const components = suggestion.components;

    setOrder((prevOrder) => ({
      ...prevOrder,
      ulice: components.road || "",
      mesto: components.city || components.town || components.village || "",
      zeme: components.country || "",
      psc: components.postcode || "",
      adresa: suggestion.formatted, // Původní celá adresa
    }));
  };

  return (
    <Elements stripe={stripePromise}>
      <motion.div className="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <h2>Pokladna</h2>

        {/* Krokový indikátor */}
        <div className="progress-bar">
          <div className="progress" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        {/* Krok 1: Údaje pro objednávku */}
        {step === 1 && (
          <div>
            <h3>Vyplňte údaje pro objednávku</h3>
            <form>
              <input
                type="text"
                name="jmeno"
                placeholder="Jméno"
                value={order.jmeno}
                onChange={handleOrderChange}
              />
              <input
                type="text"
                name="prijmeni"
                placeholder="Příjmení"
                value={order.prijmeni}
                onChange={handleOrderChange}
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={order.email}
                onChange={handleOrderChange}
              />
              <input
                type="tel"
                name="telefon"
                placeholder="Telefon"
                value={order.telefon}
                onChange={handleOrderChange}
              />

              {/* Pole pro celou adresu */}
              <input
                type="text"
                name="adresa"
                placeholder="Zadejte celou adresu"
                value={order.adresa || ""}
                onChange={(e) => {
                  const fullAddress = e.target.value;
                  setOrder({ ...order, adresa: fullAddress });
                  handleAddressSearch(fullAddress);
                }}
              />
              <div className="autocomplete-dropdown-container">
                {addressSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onClick={() => {
                      parseAndFillAddress(suggestion);
                      setAddressSuggestions([]); // Vyčistit návrhy
                    }}
                  >
                    {suggestion.formatted}
                  </div>
                ))}
              </div>

              <motion.button
                onClick={nextStep}
                className="next-step-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Další krok
              </motion.button>
            </form>
          </div>
        )}

        {/* Krok 2: Výběr dopravy a platby */}
        {step === 2 && (
          <div>
            <h3>Vyberte způsob dopravy a platby</h3>
            <form>
              <select
                name="zpusobDopravy"
                value={order.zpusobDopravy}
                onChange={handleOrderChange}
                required
              >
                <option value="">Vyberte způsob dopravy</option>
                <option value="kuryr">Kurýr</option>
                <option value="osobni-odber">Osobní odběr</option>
                <option value="posta">Pošta</option>
              </select>
              <select
                name="zpusobPlatby"
                value={order.zpusobPlatby}
                onChange={handleOrderChange}
                required
              >
                <option value="">Vyberte způsob platby</option>
                <option value="karta">Platební karta</option>
                <option value="prevod">Bankovní převod</option>
                <option value="dobirka">Dobírka</option>
              </select>

              <motion.button
                onClick={prevStep}
                className="prev-step-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Zpět
              </motion.button>

              <motion.button
                onClick={nextStep}
                className="next-step-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Další krok
              </motion.button>
            </form>
          </div>
        )}

        {/* Krok 3: Souhrn objednávky */}
        {step === 3 && (
          <div>
            <h3>Souhrn objednávky</h3>
            <p><strong>Jméno:</strong> {order.jmeno} {order.prijmeni}</p>
            <p><strong>E-mail:</strong> {order.email}</p>
            <p><strong>Telefon:</strong> {order.telefon}</p>
            <p><strong>Adresa:</strong> {order.adresa}</p>
            <p><strong>Způsob dopravy:</strong> {order.zpusobDopravy}</p>
            <p><strong>Způsob platby:</strong> {order.zpusobPlatby}</p>
            <p><strong>Cena:</strong> {order.celkovaCena} CZK</p>

            <CheckoutForm order={order} onPaymentSuccess={handlePaymentSuccess} />

            <motion.button
              onClick={prevStep}
              className="prev-step-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Zpět
            </motion.button>
          </div>
        )}
      </motion.div>
    </Elements>
  );
};

export default Checkout;
