import React from "react";
import DashboardHeader from "../../components/DashboardHeader";

function Pesudo({ children }) {
  return (
    <div className="dashboard-content">
      <div className="dashboard-content-container">{children}</div>
    </div>
  );
}

export default Pesudo;
