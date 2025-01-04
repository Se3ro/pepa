import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../styles/HomePage.css';
import Modal from 'react-modal';
import { MdInfo, MdArrowBack, MdEco, MdOutlineNoMeals, MdSpa } from 'react-icons/md';
import anime from 'animejs';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Accordion from 'react-bootstrap/Accordion';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Helmet } from 'react-helmet-async';

const ProductDetails = ({ product, onShowModal, handleShowMore }) => (
  <div className="productDetails home">
    <h3 className="productTitle home">{product.nazev}</h3>
    <p className="productDescription home">{product.popis}</p>
    <p className="productPrice home"><strong>{product.cena} Kč</strong></p>
    <div className="icon-container home">
      <div className="icon home" data-tooltip="Vegan"><MdEco /></div>
      <div className="icon home" data-tooltip="Gluten Free"><MdOutlineNoMeals /></div>
      <div className="icon home" data-tooltip="GMO Free"><MdSpa /></div>
    </div>
    <div className="button-container home">
      <button className="btn home" onClick={onShowModal}><MdArrowBack /> Vyzkoušet</button>
      <button className="btn home" onClick={() => handleShowMore(product)}><MdInfo /> Více info</button>
    </div>
  </div>
);

const ErrorMessage = ({ message }) => (
  message ? <div className="error-message home">{message}</div> : null
);

const ContactFormModal = ({ isOpen, onRequestClose, onSubmit }) => {
  const [formData, setFormData] = useState({ jmeno: '', email: '', telefon: '' });
  const [error, setError] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const { jmeno, email, telefon } = formData;

    // Validace všech polí
    if (!jmeno || !email || !telefon) {
      setError('Prosím, vyplňte všechny údaje.');
      return;
    }

    // Validace formátu e-mailu
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Prosím, zadejte platný e-mail.');
      return;
    }

    // Ověření souhlasu s podmínkami
    if (!isAgreed) {
      setError('Musíte souhlasit se zpracováním osobních údajů.');
      return;
    }

    setError('');
    onSubmit(formData);
    setFormData({ jmeno: '', email: '', telefon: '' });
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-container contact-modal home"
      overlayClassName="modal-overlay home"
    >
      <div className="contact-modal-content home">
        <h2>Zanechte nám své kontaktní údaje</h2>
        <form>
          <div><label>Jméno:</label><input type="text" name="jmeno" value={formData.jmeno} onChange={handleChange} /></div>
          <div><label>E-mail:</label><input type="email" name="email" value={formData.email} onChange={handleChange} /></div>
          <div><label>Telefon:</label><input type="tel" name="telefon" value={formData.telefon} onChange={handleChange} /></div>
          <div>
            <input 
              type="checkbox" 
              checked={isAgreed} 
              onChange={() => setIsAgreed(!isAgreed)} 
            />
            <label>Souhlasím se zpracováním osobních údajů.</label>
          </div>
          <ErrorMessage message={error} />
          <button type="button" onClick={handleSubmit}>Odeslat</button>
          <button type="button" onClick={onRequestClose}>Zavřít</button>
        </form>
      </div>
    </Modal>
  );
};

const ConfirmationPopup = ({ isOpen, onClose }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    className="modal-container confirmation-popup home"
    overlayClassName="modal-overlay home"
  >
    <div className="confirmation-popup-content home">
      <h2>Údaje byly úspěšně odeslány!</h2>
      <p>Děkujeme za vaši důvěru. Brzy se s vámi spojíme.</p>
      <button className="close-modal-btn" onClick={onClose}>Zavřít</button>
    </div>
  </Modal>
);


const Home = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/produkty')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Chyba při načítání produktů:', error));

    anime({
      targets: '.home-container.home h1, .product-details.home, .swiper-container.home',
      opacity: [0, 1],
      translateY: [-20, 0],
      duration: 1000,
      delay: anime.stagger(100),
      easing: 'easeOutExpo',
    });
  }, []);

  const handleShowMore = (product) => {
    setModalContent({
      title: product.nazev,
      description: product.popis,
      composition: product.slozeni,
      references: [
        { id: 1, label: 'Probiotické mikroorganismy', content: 'Popis probiotik v produktu.' },
        { id: 2, label: 'Aktivní enzymy', content: 'Popis enzymů v produktu.' },
        { id: 3, label: 'Flavonoidy', content: 'Popis flavonoidů v produktu.' },
      ],
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProductClick = (index) => {
    setActiveIndex(index);
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
    anime({
      targets: '.productDetails.home',
      opacity: [0, 1],
      translateY: [-20, 0],
      duration: 500,
      easing: 'easeOutExpo',
    });
  };

  const handleShowContactModal = () => {
    setIsContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
  };

  const handleSubmitContact = (contactData) => {
    axios.post('http://localhost:8080/api/kontakty', contactData)
      .then(response => {
        console.log('Kontakt uložen:', response.data);
        setIsConfirmationPopupOpen(true);
      })
      .catch(error => {
        console.error('Chyba při odesílání kontaktu:', error);
        alert('Došlo k chybě při odesílání údajů.');
      });
  };

  const handleCloseConfirmationPopup = () => {
    setIsConfirmationPopupOpen(false);
  };

  return (
    <div className="home-container home">
      <Helmet>
        <title>{products[activeIndex]?.nazev || 'Naše produkty'}</title>
        <meta name="description" content={products[activeIndex]?.popis || 'Prohlédněte si naše produkty.'} />
        <meta property="og:image" content={products[activeIndex]?.obrazek || ''} />
      </Helmet>

      <div className="product-navigation home">
        <ul className="product-list home">
          {products.map((product, index) => (
            <li
              key={product.id}
              className={`product-item home ${index === activeIndex ? 'active home' : ''}`}
              onClick={() => handleProductClick(index)}
            >
              {product.nazev}
            </li>
          ))}
        </ul>
        <div className="product-image-container home">
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            className="swiper-container home"
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            initialSlide={activeIndex}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <img src={product.obrazek} alt={product.nazev} className="productImage home" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="product-details-container home">
          {products[activeIndex] && (
            <ProductDetails
              product={products[activeIndex]}
              onShowModal={handleShowContactModal}
              handleShowMore={handleShowMore}
            />
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="modal-container info-modal home"
        overlayClassName="modal-overlay home"
        contentLabel="Detail produktu"
      >
        <div className="info-modal-content home">
          <div className="modal-left home">
            <h2>{modalContent.title}</h2>
            <p><strong>Složení:</strong> {modalContent.composition}</p>
          </div>
          <div className="modal-right home">
            <h3>Speciální látky:</h3>
            <Accordion defaultActiveKey="0">
              {modalContent.references?.map((item) => (
                <Accordion.Item eventKey={item.id.toString()} key={item.id}>
                  <Accordion.Header>{item.label}</Accordion.Header>
                  <Accordion.Body>{item.content}</Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        </div>
        <button className="close-modal-btn" onClick={handleCloseModal}>Zavřít</button>

      </Modal>

      <ContactFormModal
        isOpen={isContactModalOpen}
        onRequestClose={handleCloseContactModal}
        onSubmit={handleSubmitContact}
      />

      <ConfirmationPopup
        isOpen={isConfirmationPopupOpen}
        onClose={handleCloseConfirmationPopup}
      />
    </div>
  );
};

export default Home;
