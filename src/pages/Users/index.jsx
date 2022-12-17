import React from "react";

function Users({ children }) {
  return (
    <div className="dashboard-content">
      <div className="dashboard-content-container">{children}</div>
    </div>
  );
}

export default Users;
