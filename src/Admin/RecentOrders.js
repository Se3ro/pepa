import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormSelect,
} from "@coreui/react";
import "./ManageOrders.css";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statuses, setStatuses] = useState([
    "NOVA",
    "ZPRACOVANA",
    "ODESLANA",
    "DOKONCENA",
    "ZRUSENA",
  ]);

  // Funkce pro načtení všech objednávek
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/objednavky");
      setOrders(response.data);
    } catch (error) {
      console.error("Chyba při načítání objednávek:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Funkce pro změnu stavu objednávky
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/objednavky/${orderId}/stav`, { stav: newStatus });
      setOrders(orders.map((order) =>
        order.id === orderId ? { ...order, stav: newStatus } : order
      ));
    } catch (error) {
      console.error("Chyba při změně stavu objednávky:", error);
    }
  };

  // Funkce pro zobrazení detailů objednávky v modalu
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Funkce pro mazání objednávky
  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8080/api/objednavky/${orderId}`);
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error("Chyba při mazání objednávky:", error);
    }
  };

  return (
    <div>
      <CCard className="order-card">
        <CCardHeader className="order-card-header">
          <h3>Správa objednávek</h3>
        </CCardHeader>
        <CCardBody>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Jméno</CTableHeaderCell>
                <CTableHeaderCell>Příjmení</CTableHeaderCell>
                <CTableHeaderCell>Cena</CTableHeaderCell>
                <CTableHeaderCell>Stav</CTableHeaderCell>
                <CTableHeaderCell>Akce</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {orders.map((order) => (
                <CTableRow key={order.id}>
                  <CTableDataCell>{order.id}</CTableDataCell>
                  <CTableDataCell>{order.jmeno}</CTableDataCell>
                  <CTableDataCell>{order.prijmeni}</CTableDataCell>
                  <CTableDataCell>{order.celkovaCena} Kč</CTableDataCell>
                  <CTableDataCell>
                    <CFormSelect
                      value={order.stav}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </CFormSelect>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="info"
                      size="sm"
                      onClick={() => handleViewDetails(order)}
                    >
                      Detaily
                    </CButton>{" "}
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      Smazat
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal pro detaily objednávky */}
      <CModal visible={isModalOpen} onClose={() => setIsModalOpen(false)} className="order-modal">
        <CModalHeader>Detaily objednávky #{selectedOrder?.id}</CModalHeader>
        <CModalBody>
          {selectedOrder && (
            <div>
              <p><strong>Jméno:</strong> {selectedOrder.jmeno}</p>
              <p><strong>Příjmení:</strong> {selectedOrder.prijmeni}</p>
              <p><strong>Email:</strong> {selectedOrder.email}</p>
              <p><strong>Cena:</strong> {selectedOrder.celkovaCena} Kč</p>
              <p><strong>Stav:</strong> {selectedOrder.stav}</p>
              <h5>Položky:</h5>
              <ul>
                {selectedOrder.polozky.map((item) => (
                  <li key={item.id}>
                    {item.produkt.nazev} - {item.mnozstvi} ks  {item.sleva} ({item.celkovaCena} Kč)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setIsModalOpen(false)}>
            Zavřít
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ManageOrders;
