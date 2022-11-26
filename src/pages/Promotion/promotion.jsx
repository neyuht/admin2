import React from 'react';
import DashboardHeader from '../../components/DashboardHeader';

function Pesudo({ children }) {
  return (
    <div className="dashboard-content">
        <DashboardHeader btnText="." />
        <div className="dashboard-content-container">
            <div className="dashboard-content-header">
                <h2>Promotion List</h2>
            </div>
            {children}
        </div>
    </div>
  );
}

export default Pesudo;
