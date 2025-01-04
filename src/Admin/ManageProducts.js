import React, { useState, useEffect } from "react";
import axios from "axios";
import { CCard, CCardBody, CCardHeader, CButton, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CModal, CModalHeader, CModalBody, CModalFooter, CForm, CFormInput, CFormSelect, CFormTextarea } from "@coreui/react";
import './ManageProducts.css'; // Import CSS pro stylování

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/produkty");
      setProducts(response.data);
    } catch (error) {
      console.error("Chyba při načítání produktů:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/produkty/${id}`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Chyba při mazání produktu:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (editingProduct.id) {
        // Aktualizace produktu
        await axios.put(`http://localhost:8080/api/produkty/${editingProduct.id}`, editingProduct);
      } else {
        // Vytvoření nového produktu
        const response = await axios.post("http://localhost:8080/api/produkty", editingProduct);
        setProducts([...products, response.data]);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Chyba při ukládání produktu:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct({
      nazev: "",
      popis: "",
      cena: "",
      slozeni: "",
      kategorie: "",
      obrazek: "",
    });
    setIsModalOpen(true);
  };

  return (
    <div>
      <CCard className="product-card">
        <CCardHeader className="product-card-header">
          <h3>Správa produktů</h3>
          <CButton color="primary" onClick={handleAdd} className="add-product-btn">
            Přidat produkt
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Název</CTableHeaderCell>
                <CTableHeaderCell>Popis</CTableHeaderCell>
                <CTableHeaderCell>Cena</CTableHeaderCell>
                <CTableHeaderCell>Kategorie</CTableHeaderCell>
                <CTableHeaderCell>Akce</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {products.map((product) => (
                <CTableRow key={product.id}>
                  <CTableDataCell>{product.id}</CTableDataCell>
                  <CTableDataCell>{product.nazev}</CTableDataCell>
                  <CTableDataCell>{product.popis}</CTableDataCell>
                  <CTableDataCell>{product.cena} Kč</CTableDataCell>
                  <CTableDataCell>{product.kategorie}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="warning" size="sm" onClick={() => handleEdit(product)}>
                      Upravit
                    </CButton>{" "}
                    <CButton color="danger" size="sm" onClick={() => handleDelete(product.id)}>
                      Smazat
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal pro přidání/úpravu produktu */}
      <CModal visible={isModalOpen} onClose={() => setIsModalOpen(false)} className="product-modal">
        <CModalHeader>{editingProduct?.id ? "Upravit produkt" : "Přidat produkt"}</CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              label="Název"
              value={editingProduct?.nazev || ""}
              onChange={(e) => setEditingProduct({ ...editingProduct, nazev: e.target.value })}
            />
            <CFormTextarea
              label="Popis"
              value={editingProduct?.popis || ""}
              onChange={(e) => setEditingProduct({ ...editingProduct, popis: e.target.value })}
            />
            <CFormInput
              label="Cena (Kč)"
              type="number"
              value={editingProduct?.cena || ""}
              onChange={(e) => setEditingProduct({ ...editingProduct, cena: parseFloat(e.target.value) })}
            />
            <CFormInput
              label="Složení"
              value={editingProduct?.slozeni || ""}
              onChange={(e) => setEditingProduct({ ...editingProduct, slozeni: e.target.value })}
            />
            <CFormSelect
              label="Kategorie"
              value={editingProduct?.kategorie || ""}
              onChange={(e) => setEditingProduct({ ...editingProduct, kategorie: e.target.value })}
            >
              <option value="">Vyberte kategorii</option>
              <option value="ELEKTRONIKA">Elektronika</option>
              <option value="OBLECENI">Oblečení</option>
              <option value="JIDLO">Jídlo</option>
            </CFormSelect>
            <CFormInput
              label="Odkaz na obrázek"
              value={editingProduct?.obrazek || ""}
              onChange={(e) => setEditingProduct({ ...editingProduct, obrazek: e.target.value })}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSave}>
            Uložit
          </CButton>
          <CButton color="secondary" onClick={() => setIsModalOpen(false)}>
            Zrušit
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default ManageProducts;
