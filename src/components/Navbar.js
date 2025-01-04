import React, { useState } from 'react';
import { Navbar, Nav, Container, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

// Import GIFy
import ShoppingCart from '../assets/shopping-cart.png';
import FacebookGif from '../assets/facebook.gif';
import InstagramGif from '../assets/instagram.gif';
import TwitterGif from '../assets/twitter.gif';
import Logog from '../assets/logo.png';
import nazev from '../assets/nazev.png';
import ikonaKoupit from '../assets/bottle.png';
import ikonaProhlaseni from '../assets/ikonaPrihlaseni.png';

const CustomNavbar = ({ cartCount }) => {
  const [showModal, setShowModal] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleMouseEnter = (iconName) => {
    setHoveredIcon(iconName);
  };

  const handleMouseLeave = () => {
    setHoveredIcon(null);
  };

  return (
    <>
      <Navbar expand="lg" className="custom-navbar fixed-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="navbar-brand">
            <img 
              src={nazev}
              alt="Logo" 
              className="brand-photo" 
            />
          </Navbar.Brand>

          <div className="navbar-center-logo">
            <img src={Logog} alt="Logo" className="center-logo" />
          </div>

          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/cart" className="nav-link cart-link">
              <img
                src={ShoppingCart}
                alt="Shopping Cart"
                className="shopping-cart"
                onMouseEnter={() => handleMouseEnter('shoppingCart')}
                onMouseLeave={handleMouseLeave}
              />
              {cartCount > 0 && <span className="cart-count">({cartCount})</span>}
            </Nav.Link>
            <Button 
            variant="primary" 
            className="menu-button" 
            onClick={handleShow}
          >
            Menu
          </Button>
          

          </Nav>
        </Container>
      </Navbar>

      <Modal show={showModal} onHide={handleClose} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body className="fullscreen-modal-body">
        <Nav className="flex-column text-center">
        <div className="nav-item">
          <div className="icons-container">
            <div className="icon-with-text">
              <h5>Koupit Jellycion</h5>
              <Nav.Link as={Link} to="/products" onClick={handleClose} className="nav-link produkt link">
                <img
                  src={ikonaKoupit}
                  alt="Produkty"
                  className="Link-produkty"
                  onMouseEnter={() => handleMouseEnter('shoppingCart')}
                  onMouseLeave={handleMouseLeave}
                />
              </Nav.Link>
            </div>
            <div className="icon-with-text">
              <h5>Přihlásit se</h5>
              <Nav.Link as={Link} to="/login" onClick={handleClose} className="nav-link">
                <img
                  src={ikonaProhlaseni}
                  alt="Přihlášení"
                  className="ikona-prihlaseni"
                  onMouseEnter={() => handleMouseEnter('shoppingCart')}
                  onMouseLeave={handleMouseLeave}
                />
              </Nav.Link>
            </div>
          </div>
        </div>
      </Nav>
      
      

          <footer className="footer">
            <div className="footer-container">
              <div className="footer-section">
                <h4>Kontakt</h4>
                <p>Email: info@firma.com</p>
                <p>Telefon: +420 123 456 789</p>
                <p>Adresa: Ulice 123, Město, Česká republika</p>
              </div>
              <div className="footer-section social-links">
                <h4>Sociální Sítě</h4>
                <div className="social-icons">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <img
                      src={FacebookGif}
                      alt="Facebook"
                      style={{ width: '24px', height: '24px' }}
                      onMouseEnter={() => handleMouseEnter('facebook')}
                      onMouseLeave={handleMouseLeave}
                    />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <img
                      src={InstagramGif}
                      alt="Instagram"
                      style={{ width: '24px', height: '24px' }}
                      onMouseEnter={() => handleMouseEnter('instagram')}
                      onMouseLeave={handleMouseLeave}
                    />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <img
                      src={TwitterGif}
                      alt="Twitter"
                      style={{ width: '24px', height: '24px' }}
                      onMouseEnter={() => handleMouseEnter('twitter')}
                      onMouseLeave={handleMouseLeave}
                    />
                  </a>
                </div>
              </div>
              <div className="footer-section">
                <h4>O Nás</h4>
                <p>Jsme firma zabývající se prodejem kvalitního zboží. Naší prioritou je spokojenost zákazníků a kvalitní služby.</p>
              </div>
              <div className="footer-section">
                <h4>Newsletter</h4>
                <p>Přihlaste se k odběru novinek a akcí!</p>
                <input type="email" placeholder="Zadejte svůj email" />
                <button type="button">Přihlásit</button>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© 2025 Název Firmy. Všechna práva vyhrazena.</p>
            </div>
          </footer>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomNavbar;
