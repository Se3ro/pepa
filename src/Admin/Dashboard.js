import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import StatisticsChart from "./StatisticsChart";
import RecentOrders from "./RecentOrders";
import ManageProducts from "./ManageProducts";

const AdminPanel = () => {
  const [selectedTab, setSelectedTab] = useState("dashboard");

  const renderContent = () => {
    switch (selectedTab) {
      case "dashboard":
        return <StatisticsChart />;
      case "orders":
        return <RecentOrders />;
      case "products":
        return   <ManageProducts />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminNavbar onSelect={setSelectedTab} />
      <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;
