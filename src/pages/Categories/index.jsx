import React from "react";

function Categories({ children }) {
  return (
    <div className="dashboard-content">
      <div className="dashboard-content-container">{children}</div>
    </div>
  );
}

export default Categories;
