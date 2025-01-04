import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrace komponenty Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsChart = () => {
  const [statistics, setStatistics] = useState({
    pocetProduktu: 0,
    pocetObjednavek: 0,
    celkoveVydelky: 0,
    pocetUnikatnichZakazniku: 0,
    nejprodavanejsiProdukty: [],
    prumernaHodnotaObjednavky: 0,
    konverzniMira: 0,
    prumernaHodnotaZakaznika: 0,
    pocetOpakovanychObjednavek: 0,
    topZakaznici: [],
    nejlepsiKategorie: {},
    prumernaDobaMeziObjednavkami: 0,
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Počet objednávek",
        data: [],
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Celkové výdělky (Kč)",
        data: [],
        borderColor: "#28a745",
        backgroundColor: "rgba(40, 167, 69, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/statistiky");
        const data = response.data;

        setStatistics(data);
        setChartData({
          labels: ["Statistiky"],
          datasets: [
            {
              ...chartData.datasets[0],
              data: [data.pocetObjednavek],
            },
            {
              ...chartData.datasets[1],
              data: [data.celkoveVydelky],
            },
          ],
        });
      } catch (error) {
        console.error("Chyba při načítání statistik:", error);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <CRow>
      <CCol md={4}>
        <CCard className="text-center shadow">
          <CCardHeader>Počet produktů</CCardHeader>
          <CCardBody>
            <h3>{statistics.pocetProduktu}</h3>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={4}>
        <CCard className="text-center shadow">
          <CCardHeader>Počet objednávek</CCardHeader>
          <CCardBody>
            <h3>{statistics.pocetObjednavek}</h3>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={4}>
        <CCard className="text-center shadow">
          <CCardHeader>Celkové výdělky</CCardHeader>
          <CCardBody>
            <h3>{statistics.celkoveVydelky} Kč</h3>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={6} className="mt-4">
        <CCard className="text-center shadow">
          <CCardHeader>Průměrná hodnota objednávky</CCardHeader>
          <CCardBody>
            <h3>{statistics.prumernaHodnotaObjednavky.toFixed(2)} Kč</h3>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={6} className="mt-4">
        <CCard className="text-center shadow">
          <CCardHeader>Počet unikátních zákazníků</CCardHeader>
          <CCardBody>
            <h3>{statistics.pocetUnikatnichZakazniku}</h3>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12} className="mt-4">
        <CCard>
          <CCardHeader>Nejprodávanější produkty</CCardHeader>
          <CCardBody>
            {statistics.nejprodavanejsiProdukty.length > 0 ? (
              <ul>
                {statistics.nejprodavanejsiProdukty.map((produkt, index) => (
                  <li key={index}>{produkt}</li>
                ))}
              </ul>
            ) : (
              <p>Žádné produkty nejsou momentálně dostupné.</p>
            )}
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12} className="mt-4">
        <CCard>
          <CCardHeader>Top zákazníci</CCardHeader>
          <CCardBody>
            {statistics.topZakaznici.length > 0 ? (
              <ul>
                {statistics.topZakaznici.map((zakaznik, index) => (
                  <li key={index}>{zakaznik}</li>
                ))}
              </ul>
            ) : (
              <p>Žádní zákazníci nejsou momentálně dostupní.</p>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Graf pro počet objednávek a celkové výdělky */}
      <CCol xs={12} className="mt-4">
        <CCard>
          <CCardHeader>Počet objednávek a Celkové výdělky</CCardHeader>
          <CCardBody>
            <Line data={chartData} />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default StatisticsChart;
