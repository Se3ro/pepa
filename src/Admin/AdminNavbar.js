// AdminNavbar.js
import React from "react";
import { CNav, CNavItem, CNavLink } from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faBox, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import "./AdminNavbar.css"; // Import stylu

const AdminNavbar = ({ onSelect }) => {
  return (
    <div className="admin-navbar">
      <CNav vertical className="admin-nav">
        <CNavItem className="admin-nav-item">
          <CNavLink className="admin-nav-link" onClick={() => onSelect("dashboard")}>
            <FontAwesomeIcon icon={faChartLine} className="admin-icon" />
            Dashboard
          </CNavLink>
        </CNavItem>
        <CNavItem className="admin-nav-item">
          <CNavLink className="admin-nav-link" onClick={() => onSelect("orders")}>
            <FontAwesomeIcon icon={faClipboardList} className="admin-icon" />
            Objednávky
          </CNavLink>
        </CNavItem>
        <CNavItem className="admin-nav-item">
          <CNavLink className="admin-nav-link" onClick={() => onSelect("products")}>
            <FontAwesomeIcon icon={faBox} className="admin-icon" />
            Produkty
          </CNavLink>
        </CNavItem>
      </CNav>
    </div>
  );
};

export default AdminNavbar;