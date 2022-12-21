import React from "react";

import "../styles.css";
import DashboardHeader from "../../components/DashboardHeader";
function ViewProfile() {
  return (
    <div className="dashboard-content">
      <div className="dashboard-content-container">
        <div className="dashboard-content-header">
          <h2>View Profile</h2>
        </div>
        <div className="wapper">
          <div className="admin-left">
            <div className="avatar-admin">
              <img src="https://reqres.in/img/faces/9-image.jpg" alt="" />
              <div className="fullname">Tran An Thuyen</div>
            </div>
          </div>
          <div className="admin-right">
            <div className="left">
              <label>Login Name</label>
              <div className="buttom-text">Lorem ipsum dolor sit amet</div>
            </div>
            <div className="right">
              <label>CreateAt</label>
              <div className="buttom-text">Lorem ipsum dolor sit amet</div>
            </div>
            <div className="left">
              <label>Status</label>
              <div className="buttom-text">Lorem ipsum dolor sit amet</div>
            </div>
            <div className="right">
              <label>UpdateAt</label>
              <div className="buttom-text">Lorem ipsum dolor sit amet</div>
            </div>
            <div className="left">
              <label>Super Admin</label>
              <div className="buttom-text">Lorem ipsum dolor sit amet</div>
            </div>
            <div className="right">
              <label>Password</label>
              <div className="buttom-text">Lorem ipsum dolor sit amet</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;
